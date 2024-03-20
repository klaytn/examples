import { Button, HStack, Input } from "@chakra-ui/react";
import React from "react";

type Props = {
  type: "native" | "token";
  tokenSymbol?: string;
  tokenBalance: string
  current: string;
  setValue: (value: string) => void;
  max?: string;
  value: string;
};

export default function SwapInput({
  type,
  tokenSymbol,
  tokenBalance,
  setValue,
  value,
  current,
  max,
}: Props) {
  return (
    <HStack w="full" bgColor="gray.100" rounded="2xl" px="5">
      <Input
        type="number"
        placeholder="0.0"
        fontSize="3xl"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        outline="none"
        py="10"
        isDisabled={current !== type}
        border="none"
        fontFamily="monospace"
        _focus={{ boxShadow: "none" }}
      />
      <div>
        <p>{tokenSymbol}</p>
        <p>Balance: {tokenBalance}</p>
      </div>
      {current === type && (
        <Button onClick={() => setValue(max || "0")}>Max</Button>
      )}
    </HStack>
  );
}
