function getUserId() {
    const userId = localStorage.getItem('userId') || generateUserID();
    localStorage.setItem('userId', userId);
    return userId
}


function generateUserID() {
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    const userID = `${timestamp}${randomNumber}`;
    return userID;
}