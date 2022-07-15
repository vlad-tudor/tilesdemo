import { Button } from "@mui/material";
import React from "react";

type ResetButtonProps = {
  light?: boolean;
  thingToReset: string;
  onClick: (e: React.MouseEvent) => void;
};

export const ResetButton = ({
  thingToReset,
  onClick,
  light,
}: ResetButtonProps) => (
  <div className="reset-button">
    <Button
      color="error"
      variant={light ? "text" : "contained"}
      onClick={onClick}
    >
      RESET {thingToReset}
    </Button>
  </div>
);
