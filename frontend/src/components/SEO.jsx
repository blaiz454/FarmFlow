import { useSEO } from "../hooks/useSEO";

/**
 * Declarative wrapper around useSEO so pages can just render
 * <SEO title="..." description="..." path="/about" /> at the top of
 * their JSX instead of calling the hook directly. Renders nothing.
 */
export default function SEO(props) {
  useSEO(props);
  return null;
}
