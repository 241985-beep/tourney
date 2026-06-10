const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to open database:', err.message);
    process.exit(1);
  }
  
  console.log('⚔ Seeding SQLite database... ⚔');

  db.serialize(() => {
    // 1. Seed admin user
    db.get("SELECT * FROM users WHERE username = 'admin'", (err, row) => {
      if (!row) {
        db.run(
          `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`,
          ['admin', 'admin@kingdom.com', 'adminpass', 'admin'],
          (err) => {
            if (err) console.error('Error seeding admin user:', err.message);
            else console.log('👑 Admin user seeded.');
          }
        );
      } else {
        console.log('👑 Admin user already exists.');
      }
    });

    // 2. Seed registrations
    const mockRegistrations = [
      ["Sir Galahad", "galahad@camelot.com", "Swordfight", "Stripe", "Paid", 15.0],
      ["Sir Arthur", "arthur@camelot.com", "Jousting", "Gold Coins", "Paid", 20.0],
      ["Sir Lancelot", "lancelot@camelot.com", "Chess", "PayPal", "Paid", 5.0],
      ["Lady Guinevere", "guinevere@camelot.com", "Archery", "USDT", "Paid", 10.0]
    ];
    
    mockRegistrations.forEach(([name, email, tournament, method, status, fee]) => {
      db.run(
        `INSERT INTO registrations (playerName, playerEmail, tournamentName, paymentMethod, paymentStatus, feePaid) VALUES (?, ?, ?, ?, ?, ?)`,
        [name, email, tournament, method, status, fee],
        function(err) {
          if (err) console.error(`Error seeding registration for ${name}:`, err.message);
          else console.log(`📜 Seeded registration for ${name} (ID: ${this.lastID}).`);
        }
      );
    });

    // 3. Seed scores
    const mockScores = [
      ["Sir Arthur", 9500],
      ["Sir Lancelot", 8800],
      ["Sir Ragnar", 7900],
      ["Sir Leon", 7200],
      ["Sir Cedric", 6500]
    ];

    mockScores.forEach(([name, score]) => {
      db.run(
        `INSERT INTO scores (playerName, score) VALUES (?, ?)`,
        [name, score],
        function(err) {
          if (err) console.error(`Error seeding score for ${name}:`, err.message);
          else console.log(`🏆 Seeded score for ${name} (${score} points).`);
        }
      );
    });

    // 4. Seed contact messages
    const mockMessages = [
      ["Sir Robin", "robin@camelot.com", "Hark! I wish to know if the archery matches allow composite bows."],
      ["Sir Bedevere", "bedevere@camelot.com", "Are the jousting lances supplied or must we bring our own?"]
    ];

    mockMessages.forEach(([name, email, message]) => {
      db.run(
        `INSERT INTO messages (name, email, message) VALUES (?, ?, ?)`,
        [name, email, message],
        function(err) {
          if (err) console.error(`Error seeding message from ${name}:`, err.message);
          else console.log(`✉ Seeded message from ${name}.`);
        }
      );
    });
  });
});
