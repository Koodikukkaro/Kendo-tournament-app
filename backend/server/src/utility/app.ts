import express, {
  type Application,
  type Request,
  type Response
} from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../../build/swagger.json";
import { globalErrorHandlerMiddleware } from "../middlewares/globalErrorHandler";
import { RegisterRoutes } from "../../build/routes";
import cookieParser from "cookie-parser";
import cors from "cors";

export function CreateApp(): Application {
  const app = express();

  /**
   * To use build-in JSON middleware from express
   * & parse incoming request bodies with URL-encoded payloads
   */
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(
    cors({
      origin: "http://localhost:3000"
    })
  );

  /* Register the auto generated routes */
  RegisterRoutes(app);

  /* Serves swagger */
  app.use("/docs", swaggerUi.serve, (_req: Request, res: Response) => {
    return res.send(swaggerUi.generateHTML(swaggerDocument));
  });

  /* Error handling middleware */
  app.use(globalErrorHandlerMiddleware);

  return app;
}
