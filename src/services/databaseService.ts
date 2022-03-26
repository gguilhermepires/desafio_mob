import database from '../models';

class DatabaseService {
    public static getDatabase(){
        return database.getConnection();
    }
}

export default DatabaseService;