import DesignWallHeader from "@/components/DesignWallHeader";
import DesignWallGrid from "@/components/DesignWallGrid";

export default function DesignWall() {
  return (
    <div style={{ position: "relative" }}>
      <DesignWallGrid />
      <DesignWallHeader />
    </div>
  );
}
