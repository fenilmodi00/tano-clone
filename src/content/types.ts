/**
 * Typed content model for the captured route pages.
 *
 * The schemas live in ./schema so runtime validation and compile-time types
 * cannot drift; route code keeps importing the type names from this module.
 */

export type { Page } from "./schema";
