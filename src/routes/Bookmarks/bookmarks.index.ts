import { createRouter } from "@/lib/create-app";

import * as handlers from "./bookmarks.handlers";
import * as routes from "./bookmarks.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create);

export default router;
