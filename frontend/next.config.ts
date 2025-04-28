/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'], // Adicione aqui o domínio da sua API para imagens
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Restrinja conforme necessário em produção
      },
    ],
  },
  // Configuração para permitir API routes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ];
  },
  // Configuração para módulos externos que precisam ser transpilados
  transpilePackages: ['antd', '@ant-design/icons'],
};

module.exports = nextConfig;