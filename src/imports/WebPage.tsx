import svgPaths from "./svg-kvgxttpi7p";
import imgEllipse2 from "../assets/dc85d524d79d04a4053a6a6af141f158c0e9b5bb.png";
import imgEllipse1 from "../assets/27c3eab93fe5ad1997b18ead33625dce417df4c2.png";
import imgProfilePicture from "../assets/ee35dae001cba7772f5d3a802010a54031e7442f.png";
import imgImage1 from "../assets/be31261aa7d54f90cd871f13f3c2994720b2f880.png";

function Group1() {
  return (
    <div className="absolute left-[940px] size-[40px] top-[20px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="Group 2">
          <rect data-figma-bg-blur-radius="50" fill="url(#paint0_linear_1_136)" fillOpacity="0.67" height="40" id="Rectangle 2" rx="8" width="40" />
          <path d={svgPaths.p3a200e00} fill="var(--fill-0, white)" id="Vector" />
        </g>
        <defs>
          <clipPath id="bgblur_0_1_136_clip_path" transform="translate(50 50)">
            <rect height="40" rx="8" width="40" />
          </clipPath>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_136" x1="-2.3413e-06" x2="15.3055" y1="20" y2="57.1688">
            <stop stopColor="#A592C4" />
            <stop offset="1" stopColor="#845EBD" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function MessageBox() {
  return (
    <div className="absolute h-[80px] left-[165px] overflow-clip rounded-[20px] top-[485px] w-[1000px]" data-name="Message box">
      <div className="absolute backdrop-blur-[25px] backdrop-filter bg-gradient-to-r border border-solid border-white from-[rgba(56,55,73,0.56)] h-[80px] left-0 rounded-[20px] to-[rgba(19,15,25,0.56)] top-0 w-[1000px]" data-name="background" />
      <p className="absolute font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[normal] left-[135.5px] text-[16px] text-center text-nowrap text-white top-[calc(50%-6px)] tracking-[-0.32px] translate-x-[-50%]">Message AI Chat...</p>
      <div className="absolute inset-[41.25%_95.3%_41.25%_3.3%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
          <path d={svgPaths.p2d909600} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
      <Group1 />
    </div>
  );
}

function Content() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[normal] place-items-start relative shrink-0" data-name="content">
      <p className="[grid-area:1_/_1] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold ml-[68px] mt-0 relative text-[20px] text-center text-nowrap text-white translate-x-[-50%]">Smart Budget</p>
      <p className="[grid-area:1_/_1] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium ml-0 mt-[38px] relative text-[12px] text-[rgba(255,255,255,0.6)] w-[242px]">A budget that fits your lifestyle, not the other way around</p>
    </div>
  );
}

function Tile() {
  return (
    <div className="absolute backdrop-blur-[25px] backdrop-filter content-stretch flex flex-col h-[129px] items-start left-[165px] px-[39px] py-[33px] rounded-[20px] top-[585px] w-[320px]" data-name="tile1" style={{ backgroundImage: "linear-gradient(199.881deg, rgba(56, 55, 73, 0.56) 21.87%, rgba(19, 15, 25, 0.56) 84.48%)" }}>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[20px]" />
      <Content />
    </div>
  );
}

function Content1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[normal] place-items-start relative shrink-0" data-name="content">
      <p className="[grid-area:1_/_1] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold ml-0 mt-0 relative text-[20px] text-white w-[93px]">Analytics</p>
      <p className="[grid-area:1_/_1] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium ml-0 mt-[38px] relative text-[12px] text-[rgba(255,255,255,0.6)] w-[242px]">Analytics empowers individuals and businesses to make smarter</p>
    </div>
  );
}

function Tile1() {
  return (
    <div className="absolute backdrop-blur-[25px] backdrop-filter content-stretch flex flex-col h-[129px] items-start left-[505px] px-[39px] py-[33px] rounded-[20px] top-[585px] w-[320px]" data-name="tile2" style={{ backgroundImage: "linear-gradient(199.881deg, rgba(56, 55, 73, 0.56) 21.87%, rgba(19, 15, 25, 0.56) 84.48%)" }}>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[20px]" />
      <Content1 />
    </div>
  );
}

function Content2() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[normal] place-items-start relative shrink-0" data-name="content">
      <p className="[grid-area:1_/_1] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold ml-0 mt-0 relative text-[20px] text-nowrap text-white">Spending</p>
      <p className="[grid-area:1_/_1] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium ml-0 mt-[38px] relative text-[12px] text-[rgba(255,255,255,0.6)] w-[242px]">Spending is the way individuals and businesses use thier financial</p>
    </div>
  );
}

function Tile2() {
  return (
    <div className="absolute backdrop-blur-[25px] backdrop-filter content-stretch flex flex-col h-[129px] items-start left-[845px] px-[39px] py-[33px] rounded-[20px] top-[585px] w-[320px]" data-name="tile3" style={{ backgroundImage: "linear-gradient(199.881deg, rgba(56, 55, 73, 0.56) 21.87%, rgba(19, 15, 25, 0.56) 84.48%)" }}>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[20px]" />
      <Content2 />
    </div>
  );
}

function Animated3DModel() {
  return (
    <div className="absolute contents left-[594px] top-[160px]" data-name="Animated 3d model">
      <div className="absolute left-[594px] size-[145px] top-[160px]">
        <div className="absolute inset-[-33.45%]">
          <img alt="" className="block max-w-none size-full" height="242" src={imgEllipse2} width="242" />
        </div>
      </div>
      <div className="absolute left-[607px] size-[120px] top-[163px]">
        <img alt="" className="block max-w-none size-full" height="120" src={imgEllipse1} width="120" />
      </div>
    </div>
  );
}

function MainChatPage() {
  return (
    <div className="absolute h-[1024px] left-[265px] overflow-clip top-0 w-[1332px]" data-name="Main Chat Page">
      <div className="absolute backdrop-blur-[25px] backdrop-filter h-[1024px] left-0 top-0 w-[1330px]" data-name="Background" style={{ backgroundImage: "linear-gradient(212.397deg, rgba(20, 10, 20, 0.7) 14.032%, rgba(106, 99, 129, 0.7) 47.283%, rgba(22, 12, 22, 0.7) 81.838%)" }} />
      <MessageBox />
      <Tile />
      <Tile1 />
      <Tile2 />
      <div className="absolute font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[1.5] left-1/2 text-[36px] text-center text-nowrap text-white top-[333px] tracking-[-0.72px] translate-x-[-50%]">
        <p className="mb-0">Good Evening, Kamran.</p>
        <p>Can I help you with anything?</p>
      </div>
      <Animated3DModel />
    </div>
  );
}

function Logo() {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-start left-[34px] top-[33px]" data-name="Logo">
      <div className="h-[20.159px] relative shrink-0 w-[20.029px]" data-name="logo">
        <div className="absolute inset-[-19.84%_-19.97%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29 29">
            <g filter="url(#filter0_n_1_132)" id="logo">
              <path d={svgPaths.p1f4de500} stroke="url(#paint0_linear_1_132)" strokeLinecap="round" strokeOpacity="0.79" strokeWidth="8" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="28.1589" id="filter0_n_1_132" width="28.0293" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feTurbulence baseFrequency="10 10" numOctaves="3" result="noise" seed="2221" stitchTiles="stitch" type="fractalNoise" />
                <feColorMatrix in="noise" result="alphaNoise" type="luminanceToAlpha" />
                <feComponentTransfer in="alphaNoise" result="coloredNoise1">
                  <feFuncA type="discrete" />
                </feComponentTransfer>
                <feComposite in="coloredNoise1" in2="shape" operator="in" result="noise1Clipped" />
                <feFlood floodColor="rgba(0, 0, 0, 0.45)" result="color1Flood" />
                <feComposite in="color1Flood" in2="noise1Clipped" operator="in" result="color1" />
                <feMerge result="effect1_noise_1_132">
                  <feMergeNode in="shape" />
                  <feMergeNode in="color1" />
                </feMerge>
              </filter>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_132" x1="14.015" x2="14.015" y1="4.00028" y2="24.1588">
                <stop stopColor="white" />
                <stop offset="1" stopColor="#845EBD" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <p className="font-['FONTSPRING_DEMO_-_Integral_CF:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white">BrainBot</p>
    </div>
  );
}

function NewChat() {
  return (
    <div className="backdrop-blur-[25px] backdrop-filter content-stretch flex gap-[7px] h-[40px] items-center overflow-clip pl-[12px] pr-[135px] py-[11px] relative rounded-[10px] shrink-0 w-[175px]" data-name="New chat" style={{ backgroundImage: "linear-gradient(174.623deg, rgba(165, 146, 196, 0.67) 35.416%, rgba(132, 94, 189, 0.67) 112.4%), linear-gradient(90deg, rgba(56, 55, 73, 0.56) 0%, rgba(73, 75, 83, 0.56) 100%)" }}>
      <div className="relative shrink-0 size-[16px]" data-name="chat icon">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <path d={svgPaths.p20d35d00} fill="var(--fill-0, white)" id="chat icon" />
        </svg>
      </div>
      <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[12px] text-center text-nowrap text-white">New chat</p>
    </div>
  );
}

function SearhBarForChats() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="Searh bar for chats">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g data-figma-bg-blur-radius="50" id="Searh bar for chats">
          <rect fill="url(#paint0_linear_1_140)" fillOpacity="0.1" height="40" rx="10" width="40" />
          <rect height="39" rx="9.5" stroke="var(--stroke-0, white)" strokeOpacity="0.2" width="39" x="0.5" y="0.5" />
          <path d={svgPaths.p3965b000} fill="var(--fill-0, white)" id="search icon" />
        </g>
        <defs>
          <clipPath id="bgblur_0_1_140_clip_path" transform="translate(50 50)">
            <rect height="40" rx="10" width="40" />
          </clipPath>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_140" x1="0" x2="40" y1="20" y2="20">
            <stop stopColor="#292D33" />
            <stop offset="1" stopColor="#20242B" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function NewChatSearch() {
  return (
    <div className="absolute content-stretch flex gap-[10px] items-start left-[25px] top-[84px] w-[225.928px]" data-name="new chat + search">
      <NewChat />
      <SearhBarForChats />
    </div>
  );
}

function RecentChats() {
  return (
    <div className="absolute content-stretch flex flex-col font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium gap-[6px] items-start leading-[normal] left-[25px] text-[12px] top-[155px] w-[134px]" data-name="recent chats">
      <p className="relative shrink-0 text-[rgba(255,255,255,0.6)] w-full">Your chats</p>
      <p className="relative shrink-0 text-white w-full">Welcome to BrainBot</p>
      <p className="relative shrink-0 text-white w-full">Run a image in docker</p>
      <p className="relative shrink-0 text-white w-full">Instagram bio chat idea</p>
    </div>
  );
}

function Group() {
  return (
    <div className="font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[normal] place-items-start relative shrink-0 text-[12px]">
      <p className="[grid-area:1_/_1] ml-0 mt-0 relative text-white w-[135px]">Syed Kamran T</p>
      <p className="[grid-area:1_/_1] ml-0 mt-[20px] relative text-[rgba(255,255,255,0.7)] w-[85.179px]">Free Plan</p>
    </div>
  );
}

function Profile() {
  return (
    <div className="absolute content-stretch flex gap-[10px] items-center left-[25px] top-[959px]" data-name="Profile">
      <div className="relative rounded-[20px] shrink-0 size-[40px]" data-name="Profile Picture">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[20px]">
          <div className="absolute bg-[#d9d9d9] inset-0 rounded-[20px]" />
          <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[20px] size-full" src={imgProfilePicture} />
        </div>
      </div>
      <Group />
      <div className="h-[7.071px] relative shrink-0 w-[10.527px]" data-name="Dropdown">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 8">
          <path d={svgPaths.p3a486b00} fill="var(--fill-0, white)" id="Dropdown" />
        </svg>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <div className="absolute border-[0px_1px_0px_0px] border-[rgba(255,255,255,0.1)] border-solid h-[1024px] left-0 overflow-clip top-0 w-[265px]" data-name="Sidebar">
      <div className="absolute backdrop-blur-[25px] backdrop-filter h-[1026px] left-[-2px] top-0 w-[267px]" data-name="Background" style={{ backgroundImage: "linear-gradient(192.383deg, rgba(56, 55, 73, 0.37) 1.5697%, rgba(14, 11, 17, 0.37) 97.97%)" }} />
      <Logo />
      <NewChatSearch />
      <RecentChats />
      <Profile />
    </div>
  );
}

export default function WebPage() {
  return (
    <div className="bg-white relative size-full" data-name="Web Page">
      <div className="absolute h-[1024px] left-[-2px] top-0 w-[1599px]" data-name="image 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-full left-[-1.14%] max-w-none top-0 w-[113.85%]" src={imgImage1} />
        </div>
      </div>
      <MainChatPage />
      <Sidebar />
    </div>
  );
}