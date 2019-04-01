const fs = require('fs')
const path = require('path')

const { NestFactory } = require('@nestjs/core')
const { FastifyAdapter } = require('@nestjs/platform-fastify')
const { SwaggerModule, DocumentBuilder } = require('@nestjs/swagger')

async function bootstrap(AppModule, options) {
  const app = await NestFactory.create(AppModule, new FastifyAdapter())
  const packageInfo = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8'))

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle(packageInfo.name)
      .setDescription(packageInfo.description)
      .setVersion(packageInfo.version)
      .build(),
    {
      include: options.documentProviders
    }
  )

  SwaggerModule.setup(`docs/${packageInfo.name}`, app, document)

  await app.listen(options.port || 3000)
}

exports.bootstrap = bootstrap
