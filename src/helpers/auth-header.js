export function authHeader() {
    // return authorization header with jwt token
    let user = JSON.parse(localStorage.getItem('user')) || {};
    user.access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGM0ZGU2Yjc3MGFkZTQyNDAzM2Q3MmYiLCJpZCI6IjVkYzRkZTZiNzcwYWRlNDI0MDMzZDcyZiIsImlhdCI6MTU3MzQ1NjEwNSwiZXhwIjoxNTc2MDQ4MTA1fQ.8_awji3-e9jWW3e8wqky1sz5qCFkfHvQXQnzUzUuJXo";
    if (user && user.access_token) {
        return { 'Authorization': 'Bearer ' + user.access_token };
    } else {
        return {};
    }
}