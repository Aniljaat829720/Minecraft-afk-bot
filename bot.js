const mineflayer = require('mineflayer')

// YAHAN APNI SERVER DETAILS DALEIN
const serverHost = 'chatpatechutadsmp.aternos.me' // Eg: myserver.aternos.me
const serverPort = 25565 // Default yahi hota hai
const botUsername = 'AFK_Bot' // Bot ka naam

let bot

function createBot() {
    bot = mineflayer.createBot({
        host: serverHost,
        port: serverPort,
        username: botUsername,
        // versions: '1.20.1' // Agar version issue ho toh uncomment karein
    })

    // --- Events ---

    // Jab bot join kare
    bot.on('spawn', () => {
        console.log(`[INFO] ${botUsername} join kar chuka hai!`)
        startAntiAFK()
    })

    // Jab bot disconnect ho (Automatic Rejoin)
    bot.on('end', (reason) => {
        console.log(`[WARNING] Bot disconnect hua: ${reason}. 5 seconds mein rejoin karega...`)
        setTimeout(createBot, 5000) // 5 second ka wait
    })

    // Jab bot mar jaye (Automatic Respawn)
    bot.on('death', () => {
        console.log(`[INFO] Bot mar gaya. Respawn ho raha hai...`)
        bot.respawn()
    })

    // Errors handle karne ke liye (Taki bot crash na ho)
    bot.on('error', (err) => {
        console.log(`[ERROR] Bot error: ${err}`)
    })
}

// --- Anti-AFK Actions (Movement & Attacks) ---
function startAntiAFK() {
    console.log('[INFO] Anti-AFK shuru ho raha hai...')

    // Har 3 second mein actions repeat karega
    setInterval(() => {
        if (!bot || !bot.entity) return

        // 1. Jump karna (Jump)
        bot.setControlState('jump', true)
        setTimeout(() => bot.setControlState('jump', false), 200)

        // 2. Hath chalana (Swing Arm/Attack)
        bot.swingArm('right')

        // 3. Choti movement (Thoda aage chalna)
        bot.setControlState('forward', true)
        setTimeout(() => bot.setControlState('forward', false), 200)

        // 4. Randomly look karna (Idhar udhar dekhna)
        const yaw = Math.random() * Math.PI * 2
        const pitch = (Math.random() - 0.5) * Math.PI
        bot.look(yaw, pitch)

    }, 3000) // 3000ms = 3 seconds
}

// Bot start karein
createBot()
