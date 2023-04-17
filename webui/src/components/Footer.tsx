import { Flex, Text } from "@mantine/core";
import { Heart } from "lucide-react";
import vekLogo from "@/assets/vek.svg";

export const Footer = () => {
  return (
    <Flex justify={"space-evenly"} bg="vek" p="md" className="footer">
      <a href="https://zeus.gent">
        <img src="https://zinc.zeus.gent/white" />
      </a>
      <Flex align={"center"} justify="center">
        <Text color="white" align="center">
          Made with <Heart fill="rgb(242, 78, 111)" stroke="rgb(242, 78, 111)" size={"1.1rem"} /> by Zeus WPI
        </Text>
      </Flex>
      <a href="https://vek.be">
        <img src={vekLogo} />
      </a>
    </Flex>
  );
};
