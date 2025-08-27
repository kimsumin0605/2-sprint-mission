import http from 'http';
import app from './app';
import { SocketIo } from './socket/socket';

// 소켓 연결
const server = http.createServer(app);
SocketIo(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
