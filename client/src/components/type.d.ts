interface IsocketProp {
    socket: Socket
}
interface ICreateRoom {
    roomName: string,
    roomType: string,
}
interface IAuth {
    success: boolean,
    redirect: boolean,
    message: string
}
// enum RoomType {
//     PUBLIC,
//     PRIVATE,
//     DEFAULT
//   }
//   interface IRoom {
//     roomName: string,
//     roomType: RoomType,
//     createdBy: string,
//     roomId: string
//   }