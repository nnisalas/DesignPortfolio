import DesignWallHeader from "@/components/DesignWallHeader";
import DesignWallStage from "@/components/DesignWallStage";

export default function DesignWall() {
  return (
    <div style={{ position: "relative" }}>
      <DesignWallStage />
      <DesignWallHeader />
    </div>
  );
}
