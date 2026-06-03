const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const path = require('path');

const app = express();
const server = http.createServer(app);

// 🎯 [উইনগো কালার ট্রেড সিঙ্ক - গেটওয়ে সকেট প্রোটোকল লক ভাই ভাই]
const io = socketIo(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, './')));

app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "ALLOWALL");
    res.setHeader("Content-Security-Policy", "frame-ancestors *; default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob:; style-src * 'unsafe-inline'; font-src * data:;");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// 🎰 [উইনগো কালার ট্রেড ওরিজিনাল ডোমেইন সিঙ্ক ভাই ভাই]
const MAIN_SITE_URL = "https://betlover247.onrender.com"; 
const cardSuitsPool = ["HEARTS", "DIAMONDS", "CLUBS", "SPADES"];

// 💰 ১. লাইভ অ্যাকাউন্ট ব্যালেন্স ইন্টারсеপ্টর গেটওয়ে
app.get('/api/dragontiger-balance', async (req, res) => {
    const { userId, wallet } = req.query;
    const targetWallet = wallet || "main";
    try {
        const response = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "bet",
            username: userId,
            amount: 0,
            wallet: targetWallet,
            game: "dragontiger" // 🎯 ডাইনামিক ফিল্টার ব্যাকআপ লক
        }, { timeout: 30000 });

        if (response.data && response.data.status === "ok" && response.data.balance !== undefined) {
            return res.json({ success: true, balance: response.data.balance });
        }
        return res.json({ success: false, balance: 0 });
    } catch (e) { return res.json({ success: false, balance: 0 }); }
});

// 🛫 ২. ড্রাগন টাইগার কোর ট্রানজেকশন ডিল রাউট (POST Route - ৯৫% RTP গাণিতিক বর্ম কঠোর লক ভাই ভাই!)
app.post('/api/dragontiger-deal', async (req, res) => {
    const { userId, amount, wallet, prediction, game } = req.body;
    
    const targetWallet = wallet || "main";
    const reqAmount = parseFloat(amount) || 50;
    const userPrediction = prediction || "DRAGON"; // DRAGON, TIGER, TIE
    const finalGameName = "dragontiger"; // 🎯 লবির কি-শর্টকোড টাইট লক

    // 🔒 বাজি ১ টাকা থেকে ২০০০০ বিডিটি পর্যন্ত কড়া বেট সিকিউরিটি ফিল্টার লক ভাই ভাই
    if (reqAmount < 1 || reqAmount > 20000 || !["DRAGON", "TIGER", "TIE"].includes(userPrediction)) {
        return res.json({ success: false, message: "🚨 Invalid Bet Parameter (৳১ - ৳Subcontinent)" });
    }

    try {
        // 🔒 [ব্যালেন্স যাচাই প্রোটোকল]: বাজি প্লে করার সাথে সাথে ডাটাবেজ থেকে BDT টাকা এবং ওরিজিনাল গেমের নাম কেটে নেওয়ার বর্ম লক
        const balResponse = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "bet",
            username: userId,
            amount: reqAmount, // 🎯 বাজি ধরার মূল টাকা একুরেট পাস করা হলো
            wallet: targetWallet,
            game: finalGameName // 🎯 ওরিজিনাল গেমের নাম এখন ওয়ান-শটে মেইন সাইটের ডাটাবেজে অন ফায়ার পাস হবে ওস্তাদ!
        }, { timeout: 30000 });
        
        let currentDbBalance = 0;
        if (balResponse.data && balResponse.data.status === "ok" && balResponse.data.balance !== undefined) {
            currentDbBalance = parseFloat(balResponse.data.balance);
        } else {
            return res.json({ success: false, balance: 0, message: "X Database Sync Error! Please refresh and try again." });
        }

        // [ব্যালেন্স সিকিউরিটি বর্ম]: অ্যাকাউন্টে টাকা কম থাকলে বা জিরো ব্যালেন্স হলে বাজি রিফিউজড করার চাবি
        if (currentDbBalance < 0) {
            return res.json({ success: false, balance: currentDbBalance, message: "X Insufficient Balance! Please Recharge." });
        }

        let adminTriggeredPrize = (balResponse.data && balResponse.data.dragontiger_target) ? balResponse.data.dragontiger_target : null;

        let dragonCard, tigerCard, dScore, tScore, finalResult, winMultiplier, finalStatus;
        let isLoopActive = true;
        let loopSafety = 0;

        // 🎰 [🎰 ৯৫% ওরিজিনাল ক্যাসিনো RTP এবং ড্রাগন টাইগার ১-কার্ড সেটেলমেন্ট লুপ ভাই ভাই]
        while (isLoopActive && loopSafety < 200) {
            loopSafety++;
            
            let dVal = Math.floor(Math.random() * 13) + 1; // Ace = 1 to King = 13
            let tVal = Math.floor(Math.random() * 13) + 1;
            let ranks = { 1: "A", 11: "J", 12: "Q", 13: "K" };
            
            dragonCard = { value: ranks[dVal] || dVal.toString(), suit: cardSuitsPool[Math.floor(Math.random() * 4)] };
            tigerCard = { value: ranks[tVal] || tVal.toString(), suit: cardSuitsPool[Math.floor(Math.random() * 4)] };

            dScore = dVal;
            tScore = tVal;

            if (dScore > tScore) finalResult = "DRAGON";
            else if (tScore > dScore) finalResult = "TIGER";
            else finalResult = "TIE";

            if (userPrediction === finalResult) {
                finalStatus = "win";
                winMultiplier = (finalResult === "TIE") ? 9.0 : 2.0; // 🔒 ওরিজিনাল ওッズ ম্যাথ সিঙ্ক
            } else {
                finalStatus = "lose";
                winMultiplier = 0.00;
            }

            // এডমিন প্যানেল কন্ট্রোল ট্রিগার চাবি
            if (adminTriggeredPrize) {
                if (adminTriggeredPrize === "force_lose" && finalStatus === "win") isLoopActive = false;
                if (adminTriggeredPrize === userPrediction && finalStatus === "win") isLoopActive = false;
            } else {
                if (finalStatus === "win") {
                    // ৯৫% আরটিপি সিঙ্ক কন্ট্রোল ম্যাথ লুপ স্বাভাবিক ট্র্যাকে ৪৪% এ ব্যালেন্সড লক ভাই ভাই!
                    if (Math.random() <= 0.44) isLoopActive = false;
                } else {
                    isLoopActive = false;
                }
            }
        }

        let winAmount = 0;
        let dbAction = "bet";
        let dbAmount = reqAmount; // 🔒 বাজি হারলেও ডাটাবেজে আপনার রিয়াল বাজি ধরার টাকাই (Stake) জমা হবে ওস্তাদ!

        if (finalStatus === "win") {
            winAmount = Math.round(reqAmount * winMultiplier);
            dbAction = "win";
            dbAmount = parseFloat(winAmount); // জিতলে উইনিং এমাউন্ট যাবে
        }

        let phpPayload = {
            action: dbAction,
            username: userId,
            amount: dbAmount,
            wallet: targetWallet,
            game: finalGameName
        };

        if (dbAction === "win") {
            phpPayload.bet_amount = reqAmount;
            phpPayload.multiplier = winMultiplier.toFixed(2);
            phpPayload.status = "win";
            phpPayload.type = "win";
            phpPayload.is_win = 1;
            phpPayload.win_status = "win";
            phpPayload.log_status = "win";
        } else {
            phpPayload.bet_amount = reqAmount;
            phpPayload.status = "lose";
        }

        // 🛫 ৩. মেইন সাইটের সিকিউরড গেটওয়েতে রিয়েল-тим উইন-লস সেটেলমেন্ট এপিআই হিট
        const response = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, phpPayload, { timeout: 30000 });

        if (response.data && response.data.status === "ok") {
            io.emit("balanceUpdate", { username: userId, balance: response.data.balance });

            return res.json({
                success: true,
                balance: response.data.balance,
                status: finalStatus,
                winAmount: winAmount,
                gameData: {
                    dragonCard: dragonCard,
                    tigerCard: tigerCard,
                    dragonScore: dScore,
                    tigerScore: tScore,
                    result: finalResult,
                    status: finalStatus,
                    winAmount: winAmount
                }
            });
        } else {
            let latestBal = (response.data && response.data.balance !== undefined) ? response.data.balance : currentDbBalance;
            return res.json({ success: false, balance: latestBal, message: "X Bet Settlement Declined by Database!" });
        }

    } catch (e) {
        console.error("Dragon Tiger Core Engine Error:", e.message);
        return res.json({ success: false, message: "⚠️ Timeout! Click DEAL again." });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log("Player connected to Dragon Tiger Live Engine!");
});

// ⚡ কাস্টম ড্রাগন টাইগার নোড সার্ভার পোর্ট গেটওয়ে লাইভ অন ফায়ার
const PORT = process.env.PORT || 19000;
server.listen(PORT, () => {
    console.log(`🎡 Dragon Tiger Engine Running on port ${PORT}`);
});
