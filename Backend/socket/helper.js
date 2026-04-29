
export const getChatRoom = (userId1, userId2) => {
    const sortedUsers = [userId1.toString(), userId2.toString()].sort();
    return 'chatRoom' + sortedUsers[0] + sortedUsers[1];
}

export const leaveAllChatRooms = (socket) => {
    const rooms = Array.from(socket?.rooms ?? []);
    rooms.forEach((room) => {
        if (room.startsWith('chatRoom')) {
            socket.leave(room);
            console.log(`Socket ${socket.id} left room ${room}`);
        }
    });
}