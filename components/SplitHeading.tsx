import { Fragment } from "react";

type Props = { as?: "h2" | "h3"; id?: string; className?: string; children: string };

/** Renders a heading whose words can be revealed one by one. Screen readers get the plain text. */
export default function SplitHeading({ as: Tag = "h2", id, className, children }: Props) {
  const words = children.trim().split(/\s+/);
  return (
    <Tag id={id} className={`split${className ? ` ${className}` : ""}`} aria-label={children}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="w" aria-hidden="true">
            <span className="wi">{word}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
