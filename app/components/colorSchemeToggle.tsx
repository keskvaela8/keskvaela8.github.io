import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";

export function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const toggleColorScheme = () =>
    setColorScheme(colorScheme === "dark" ? "light" : "dark");

  const isDark = colorScheme === "dark";

  return (
    <ActionIcon
      variant="subtle"
      onClick={toggleColorScheme}
      title={isDark ? "Hele teema" : "Tume teema"}
    >
      {isDark ? <IconSun /> : <IconMoon />}
    </ActionIcon>
  );
}
