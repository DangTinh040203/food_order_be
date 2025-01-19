import Server from '@/app';
import appConfig from '@/configs/app.config';

const server = new Server();

const PORT = appConfig.app.port;
const HOST_ADDRESS = appConfig.app.host;

const host = server.app.listen(PORT, () => {
  console.log(`Server is running at http://${HOST_ADDRESS}:` + PORT);
});

process.once('SIGUSR2', function () {
  process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGNIN', () => {
  host.close(() => {
    console.log('Process terminated');
    process.kill(process.pid, 'SIGINT');
  });
});
