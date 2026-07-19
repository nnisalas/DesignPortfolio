export default function PhoneVideo({ src, dataLb }: { src: string; dataLb?: boolean }) {
  return (
    <div
      data-lb={dataLb ? "1" : undefined}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#ddeefb",
        borderRadius: 18,
        boxShadow: "0 2px 10px rgba(44,48,54,.06)",
        width: "100%",
        aspectRatio: "4/3",
      }}
    >
      <div style={{ position: "relative", height: "94%", aspectRatio: "600/1206" }}>
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          style={{ position: "absolute", left: "6.2%", top: "2.8%", width: "87.5%", height: "94.4%", objectFit: "cover", borderRadius: "7.6%/3.7%" }}
        />
        <img src="/assets/iphone14-bezel.png" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
      </div>
    </div>
  );
}
