const app = require('./app');
const { sequelize } = require('./models');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Authenticate database connection
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connection has been established successfully.');

    // Synchronize DB models safely (creates tables if they do not exist)
    await sequelize.sync();
    console.log('✅ Database models synchronized successfully.');

    // Start HTTP Server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect/start server:', error);
    process.exit(1);
  }
}

startServer();
