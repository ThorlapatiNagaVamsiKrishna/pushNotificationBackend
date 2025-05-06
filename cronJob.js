const cron = require('node-cron');
const admin = require('./firebase');

const fcmToken = 'YOUR_DEVICE_TOKEN_HERE';

cron.schedule('* * * * *', async () => {
    const title = 'Test Product';
    console.log('⏰ Cron running - sending notification for:', title);

    const message = {
        token: fcmToken,
        notification: {
            title: `🛒 ${title} added to cart!`,
            body: `You added ${title} to your cart.`,
        },
        webpush: {
            notification: {
                title: `🛒 ${title} added to cart!`,
                body: `You added ${title} to your cart.`,
                icon: 'https://cdn3.f-cdn.com/contestentries/1483581/14106457/5c9a28c672f17_thumb900.jpg',
                image: 'https://cdn3.f-cdn.com/contestentries/1483581/14106457/5c9a28c672f17_thumb900.jpg',
                badge: 'https://cdn3.f-cdn.com/contestentries/1483581/14106457/5c9a28c672f17_thumb900.jpg',
                click_action: 'http://localhost:5173',
            },
            fcm_options: {
                link: 'http://localhost:5173',
            },
        },
    };

    try {
        const response = await admin.messaging().send(message);
        console.log('✅ Notification sent:', response);
    } catch (error) {
        console.error('❌ Error sending notification:', error.message);
    }
});
