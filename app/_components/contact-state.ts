/** Shape of the contact form's action state. Kept out of the "use server"
 *  module: such a file may only export async functions, so the initial-state
 *  constant has to live beside the client component instead. */
export type ContactState = {
  status: "idle" | "success" | "error";
  /** Field-level messages, keyed by input name. */
  fieldErrors?: Partial<Record<"name" | "email" | "company" | "intent" | "message", string>>;
  /** Form-level message shown in the status region. */
  message?: string;
};

export const CONTACT_INITIAL_STATE: ContactState = { status: "idle" };
