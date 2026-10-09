import SubpageHeader from "@/components/SubpageHeader";
import DesignWallGrid from "@/components/DesignWallGrid";

export default function DesignWall() {
  return (
    <div style={{ position: "relative" }}>
      {/* Same header as every other subpage. DesignWallHeader was a fixed,
          transparent bar that suited the old drag-around canvas; now that
          this is an ordinary scrolling page it should match the rest. */}
      <SubpageHeader />
      <DesignWallGrid />
    </div>
  );
}
