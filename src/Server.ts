import { join } from "path";
import { Configuration, Inject } from "@tsed/di";
import { PlatformApplication } from "@tsed/common";
import "@tsed/platform-express"; // /!\ keep this import
import "@tsed/ajv";
import "@tsed/swagger";
import { config } from "./config/index";
import * as statement from "./controllers/index";
import { PostgresDatasource } from "./database/datasources/PostgresDatasource";

@Configuration({
  ...config,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT ?? 8083,
  httpsPort: false,
  disableComponentsScan: true,
  ajv: {
    returnsCoercedValues: true
  },
  mount: {
    "/": [...Object.values(statement)]
  },
  swagger: [
    {
      path: "/doc",
      specVersion: "3.0.1"
    }
  ],
  middlewares: [
    "cors",
    "cookie-parser",
    "compression",
    "method-override",
    "json-parser",
    { use: "urlencoded-parser", options: { extended: true } }
  ],
  views: {
    root: join(process.cwd(), "../views"),
    extensions: {
      ejs: "ejs"
    }
  },
  exclude: ["**/*.spec.ts"]
})
export class Server {
  async $onInit(): Promise<void> {
    if (!PostgresDatasource.isInitialized) {
      return;
    }
  }
  @Inject()
  protected app: PlatformApplication;

  @Configuration()
  protected settings: Configuration;
}
