import mongoose from 'mongoose';

const db = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGO_URL);
        console.log('🚀 Banco de dados conectado 🚀');
    } catch (error) {
        console.error('⛔ Erro na conexão com banco de dados ⛔', error.message);
    }
};

export { db };
