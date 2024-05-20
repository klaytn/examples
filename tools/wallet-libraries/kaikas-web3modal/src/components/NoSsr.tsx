import dynamic from "next/dynamic";
import React, { PropsWithChildren } from "react";

function NoSsr({ children }: PropsWithChildren) {
  return <React.Fragment>{children}</React.Fragment>;
}

export default dynamic(() => Promise.resolve(NoSsr), {
  ssr: false,
});
