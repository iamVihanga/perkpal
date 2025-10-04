import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  adminAc,
  userAc
} from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
  perks: ["read", "create", "update", "delete", "publish"]
} as const;

const ac = createAccessControl(statement);

// Content-Editor custom role (with custom permissions if needed)
export const contentEditor = ac.newRole({
  perks: ["create", "delete", "read", "update"],
  user: ["list"]
});

export const admin = ac.newRole({
  perks: ["create", "delete", "read", "update", "publish"],
  ...adminAc.statements
});

export const user = ac.newRole({
  perks: ["read"],
  ...userAc.statements
});

export { ac };
