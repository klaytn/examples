import { HTMLProps } from "react";

const explorer_url = process.env.NEXT_PUBLIC_EXPLORER_URL;

export default function TxHash({
  children,
  className,
  ...props
}: Omit<HTMLProps<HTMLAnchorElement>, "children" | "href" | "target"> & { children: string }) {
  return (
    <a
      className={`text-klaytn-orange ${className}`}
      href={`${explorer_url}/tx/${children}`}
      target="_blank"
      {...props}
    >
      {children}
    </a>
  );
}
