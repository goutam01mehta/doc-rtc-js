const { DataTypes, Sequelize } = require('sequelize');

// Load environment variables
const connectionString = process.env.POSTGRES;
const database = process.env.DB_NAME;
const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const host = process.env.DB_HOST;

// Initialize Sequelize
const sequelize = new Sequelize(database, username, password, {
    host,
    dialect: 'postgres',
    logging: false,
    define: {
        freezeTableName: true,
    },
});

// Define the model
const modelName = 'documents';
const Document = sequelize.define(
    modelName,
    {
        name: { type: DataTypes.STRING(1024), allowNull: false },
        data: { type: DataTypes.BLOB, allowNull: false },
    },
    {
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['name'],
                name: `unique_${modelName}_name`,
            },
        ],
        tableName: modelName,
    }
);

// Sync and authenticate database
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
        await sequelize.sync({ alter: true }); // Use `alter: true` for schema updates during development
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

// Fetch a document by name
const fetch = async (documentName) => {
    try {
        const document = await Document.findOne({
            where: { name: documentName },
            raw: true,
        });
        return document ? document.data : undefined;
    } catch (error) {
        console.error('Error fetching document:', error);
        throw error;
    }
};

// Store or update a document
const store = async (documentName, state) => {
    try {
        await Document.upsert(
            {
                name: documentName,
                data: state,
            },
            {
                conflictFields: ['name'], // For PostgreSQL to handle conflicts
            }
        );
    } catch (error) {
        console.error('Error storing document:', error);
        throw error;
    }
};

// Export sequelize, fetch, and store
module.exports = {
    sequelize,
    fetch,
    store,
};
