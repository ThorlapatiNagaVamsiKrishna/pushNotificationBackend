const { request } = require("express");
const admin = require("../firebase");
const User = require('../Models/userModel')

const notificationController = {
    'orderNotification': async (request, response) => {
        const user = await User.findById(request.body.user)
        const message = {
            token: user.fcmToken,
            webpush: {
                notification: {
                    title: `🛒 ${request.body.title} added to cart!`,
                    body: `You added ${request.body.title} to your cart.`,
                    icon: 'https://cdn3.f-cdn.com/contestentries/1483581/14106457/5c9a28c672f17_thumb900.jpg',
                    image: 'https://cdn3.f-cdn.com/contestentries/1483581/14106457/5c9a28c672f17_thumb900.jpg',
                    badge: 'https://cdn3.f-cdn.com/contestentries/1483581/14106457/5c9a28c672f17_thumb900.jpg',
                    click_action: "http://localhost:5173"
                },
                fcm_options: {
                    link: 'http://localhost:3000',
                }
            }
        };

        try {
            const notificationResponse = await admin.messaging().send(message);
            console.log("Notification sent:", notificationResponse);
            response.status(200).json({ success: true, messageId: notificationResponse });
        } catch (error) {
            console.error("Error sending notification:", error);
            response.status(500).json({ success: false, error: error.message });
        }
    },
    'storeFcmToken': async (request, response) => {
        await User.findByIdAndUpdate({ _id: request.body.user }, { $set: { fcmToken: request.body.fcmToken } }, { new: true })
        response.status(200).json({ message: 'your fcm Token addedd succusfully' })
    },
    'sendNotificationToAll': async (request, response) => {
        const users = await User.find({ fcmToken: { $exists: true, $ne: null } }, { fcmToken: 1, _id: 0 });
        const tokenArr = users.map((each) => each.fcmToken)
        const messages = tokenArr.map(token => ({
            token: token,
            webpush: {
                notification: {
                    title: `You Have Exclusive Offers In Grab on`,
                    body: `Grab It Fast`,
                    icon: 'https://i.ytimg.com/vi/Mg_rR0MK_Ng/maxresdefault.jpg',
                    image: 'https://tse4.mm.bing.net/th?id=OIP.fjbsE0czLL1ASBOnvBG8KwHaDT&pid=Api&P=0&h=180',
                    badge: 'https://cdn3.f-cdn.com/contestentries/1483581/14106457/5c9a28c672f17_thumb900.jpg',
                    click_action: "http://localhost:5173"
                },
                fcm_options: {
                    link: 'http://localhost:3000',
                }
            }
        }));

        try {
            const results = await Promise.all(
                messages.map(message => admin.messaging().send(message))
            );
            console.log("All notifications sent:", results);
            response.status(200).json({ success: true, results });
        } catch (error) {
            console.error("Error sending notifications:", error);
            response.status(500).json({ success: false, error: error.message });
        }

    }
}

module.exports = notificationController