import mongoose from "mongoose";

const connectionDB = (url: string, databaseName: string) => {
    const connection: mongoose.Connection = mongoose.createConnection(url, {
        dbName: databaseName,
    });
    connection.on("connected", function () {
        console.log(`Successfully connected to ${connection.name} on host ${connection.host} @ port ${connection.port}`);
    });
    return connection;
};

export default connectionDB;
