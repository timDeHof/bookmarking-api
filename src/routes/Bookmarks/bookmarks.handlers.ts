import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types";

import db from "@/db";
import { bookmarks } from "@/db/schema";

import type { CreateRoute, GetOneRoute, ListRoute } from "./bookmarks.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const bookmarks = await db.query.bookmarks.findMany();

  return c.json(bookmarks);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const { url, title } = await c.req.valid("json");

  const [bookmark] = await db.insert(bookmarks).values({ url, title }).returning();

  return c.json(bookmark, HttpStatusCodes.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const bookmark = await db.query.bookmarks.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!bookmark) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(bookmark, HttpStatusCodes.OK);
};
