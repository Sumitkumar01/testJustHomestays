import React from "react";
import Container from "./Container";
import Section from "./Section";

interface SectionWithContainerProps {
  sectionId?: string;
  containerId?: string;
  sectionClassName?: string;
  containerClassName?: string;
  children: React.ReactNode;
  containerStyle?: React.CSSProperties;
}

const SectionWithContainer: React.FC<SectionWithContainerProps> = ({
  sectionId = "",
  containerId = "",
  sectionClassName = "",
  containerClassName = "",
  containerStyle={},
  children,
}) => {
  return (
    <Section id={sectionId} className={sectionClassName}>
      <Container id={containerId} className={containerClassName} style={containerStyle}>
        {children}
      </Container>
    </Section>
  );
};

export default SectionWithContainer;
