import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  BarChart3,
  Bell,
  Bot,
  FileText,
  Gauge,
  Grid2X2,
  Headphones,
  Mail,
  Mic,
  MicOff,
  Phone,
  PhoneCall,
  PhoneForwarded,
  PhoneMissed,
  PhoneOff,
  Plus,
  Search,
  UserRound,
  UsersRound,
  X,
  Zap,
} from "lucide-react";
import "./styles.css";

const NAV_ITEMS = [
  { id: "overview", label: "Home Page", hint: "Voice analytics", icon: Grid2X2 },
  { id: "conversations", label: "Conversation", hint: "Transcripts", icon: Headphones, count: 18 },
  { id: "leads", label: "Lead Management", hint: "Captured clients", icon: UsersRound, count: 12 },
  { id: "test", label: "Test Call", hint: "EC agent QA", icon: PhoneCall },
];

const VAPI_PUBLIC_KEY = "ee1d4795-4453-4456-ba50-c42a3404e1c3";
const VAPI_ASSISTANT_ID = "429bb390-be3c-4b1e-bc3a-2a717917725c";

const metrics = [
  { label: "Current live calls", value: "4", delta: "2 voice, 2 web", icon: Activity, tone: "cyan" },
  { label: "AI calls today", value: "186", delta: "+18.4% vs yesterday", icon: PhoneCall, tone: "blue" },
  { label: "AI calls last week", value: "1,248", delta: "94% answered", icon: BarChart3, tone: "green" },
  { label: "AI calls last month", value: "5,842", delta: "UAE wide traffic", icon: Gauge, tone: "blue" },
  { label: "Dropped by AI agent", value: "11", delta: "0.18% system drop", icon: PhoneMissed, tone: "orange" },
  { label: "Dropped by customer", value: "39", delta: "Mostly under 12 sec", icon: PhoneOff, tone: "red" },
];

const conversations = [
  {
    id: "c-1001",
    name: "Nadia Al Mansoori",
    company: "Dubai Retail Group",
    phone: "+971 50 128 4456",
    time: "9 min ago",
    status: "Lead qualified",
    channel: "Voice",
    summary: "Asked about retail transformation and omnichannel customer experience.",
    transcript: [
      ["AI Agent", "Thank you for calling EthikCorp. We help organizations across Dubai and the UAE with business transformation, corporate training, and engagement solutions. How may I help you today?"],
      ["Customer", "We run a retail chain and need help improving our online and store customer experience."],
      ["AI Agent", "EthikCorp supports retail and consumer businesses with digital commerce strategy, omnichannel customer journeys, supply chain visibility, data analytics, AI automation, and margin improvement. Is your priority growth, retention, or operational efficiency?"],
      ["Customer", "Customer retention and digital conversion are the biggest priorities."],
      ["AI Agent", "I can ask the transformation team to follow up. May I collect your name, company, email, and preferred callback time?"],
    ],
  },
  {
    id: "c-1002",
    name: "Rashid Khan",
    company: "Al Qusais Logistics",
    phone: "+971 55 232 1180",
    time: "22 min ago",
    status: "Callback requested",
    channel: "Voice",
    summary: "Interested in process optimization and reducing workflow bottlenecks.",
    transcript: [
      ["AI Agent", "EthikCorp can help identify bottlenecks, redesign processes, and measure operational improvement."],
      ["Customer", "We have delays in approvals and dispatch. I need someone to review the process."],
      ["AI Agent", "That fits business process transformation. The team can start with a diagnostic and map the current workflow before recommending changes."],
    ],
  },
  {
    id: "c-1003",
    name: "Aisha Rahman",
    company: "Hospitality Group Abu Dhabi",
    phone: "+971 52 892 9034",
    time: "47 min ago",
    status: "Consultation booked",
    channel: "Voice",
    summary: "Hospitality guest experience and revenue management inquiry.",
    transcript: [
      ["Customer", "Do you work with hotels?"],
      ["AI Agent", "Yes. EthikCorp supports hospitality businesses with guest experience optimization, revenue management, operational excellence, AI automation, workforce transformation, and data analytics."],
      ["Customer", "We need support with guest journey and staff efficiency."],
      ["AI Agent", "I will capture that as hospitality transformation focused on guest journey and workforce efficiency."],
    ],
  },
  {
    id: "c-1004",
    name: "Omar Farooq",
    company: "Emirates Finance",
    phone: "+971 56 340 7765",
    time: "1h ago",
    status: "Training inquiry",
    channel: "Voice",
    summary: "Asked for leadership development and team building for managers.",
    transcript: [
      ["AI Agent", "EthikCorp provides management training, leadership development, team building, sales training, customer service, soft skills, HR, and online corporate training programs."],
      ["Customer", "We need leadership development for 40 branch managers."],
      ["AI Agent", "EthikCorp can start with a Training Needs Analysis and customize the program around your UAE business context."],
    ],
  },
  {
    id: "c-1005",
    name: "Meera Nair",
    company: "Brand Activation Studio",
    phone: "+971 58 911 7012",
    time: "2h ago",
    status: "Games Revolution",
    channel: "Voice",
    summary: "Needs gamified activation concept for an event.",
    transcript: [
      ["Customer", "We want a gamified customer engagement experience."],
      ["AI Agent", "EthikCorp's Games Revolution division creates engagement experiences through gamification, AR/VR gaming, metaverse concepts, and cross-platform game development."],
    ],
  },
];

const leads = [
  { name: "Nadia Al Mansoori", place: "Dubai", phone: "+971 50 128 4456", email: "nadia@dubairetail.example", requirement: "Retail transformation, omnichannel CX, customer retention", source: "Voice", score: 94, status: "Qualified" },
  { name: "Rashid Khan", place: "Dubai", phone: "+971 55 232 1180", email: "rashid@alqlogistics.example", requirement: "Business process transformation and approval workflow review", source: "Voice", score: 86, status: "Callback" },
  { name: "Aisha Rahman", place: "Abu Dhabi", phone: "+971 52 892 9034", email: "aisha@hospitalitygroup.example", requirement: "Hospitality guest experience and workforce efficiency", source: "Voice", score: 91, status: "Booked" },
  { name: "Omar Farooq", place: "Dubai", phone: "+971 56 340 7765", email: "omar@emiratesfinance.example", requirement: "Leadership development for branch managers", source: "Voice", score: 82, status: "Training" },
  { name: "Meera Nair", place: "Sharjah", phone: "+971 58 911 7012", email: "meera@activation.example", requirement: "Gamified brand activation and event engagement", source: "Voice", score: 76, status: "New" },
  { name: "Hassan Al Kuwaiti", place: "Kuwait", phone: "+965 600 12990", email: "hassan@services.example", requirement: "Corporate transformation strategy and KPI reporting", source: "Voice", score: 88, status: "Qualified" },
  { name: "Priya Sharma", place: "Dubai", phone: "+971 54 214 9081", email: "priya@emiratesfinance.example", requirement: "Customer service excellence training", source: "Voice", score: 79, status: "Warm" },
  { name: "Dr. Amina Hassan", place: "Dubai", phone: "+971 50 890 1234", email: "amina@cityhospital.example", requirement: "Soft skills and communication training", source: "Voice", score: 84, status: "Qualified" },
];

function App() {
  const [activePage, setActivePage] = useState("overview");
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [callPanelOpen, setCallPanelOpen] = useState(false);
  const call = useVapiCall();

  return (
    <div className={`app-shell page-${activePage}`}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="main-shell">
        <Topbar activePage={activePage} setActivePage={setActivePage} openCall={() => setCallPanelOpen(true)} />
        <main className="page-canvas">
          {activePage === "overview" && <OverviewPage openCall={() => setCallPanelOpen(true)} />}
          {activePage === "conversations" && (
            <ConversationsPage
              selectedConversation={selectedConversation}
              setSelectedConversation={setSelectedConversation}
            />
          )}
          {activePage === "leads" && <LeadsPage />}
          {activePage === "test" && <TestCallPage call={call} />}
        </main>
      </div>
      <FloatingCallWidget isOpen={callPanelOpen} setIsOpen={setCallPanelOpen} call={call} />
    </div>
  );
}

function useVapiCall() {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("Ready for EC Calling Agent test.");
  const [participantCount, setParticipantCount] = useState(0);
  const [agentJoined, setAgentJoined] = useState(false);
  const [dispatchAccepted, setDispatchAccepted] = useState(false);
  const vapiRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      vapiRef.current?.stop?.();
    };
  }, []);

  function getErrorMessage(error) {
    if (!error) return "Could not start the EC Calling Agent call.";
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;
    return error.message || error.error?.message || error.error || "Could not start the EC Calling Agent call.";
  }

  async function getVapiClient() {
    if (vapiRef.current) return vapiRef.current;

    const module = await import("@vapi-ai/web");
    const Vapi = module.default?.default || module.default;
    const vapi = new Vapi(VAPI_PUBLIC_KEY);

    vapi.on("call-start", () => {
      setStatus("connected");
      setAgentJoined(true);
      setDispatchAccepted(true);
      setParticipantCount(2);
      setMessage("EC Calling Agent is live. Speak now.");
    });

    vapi.on("call-end", () => {
      setStatus("idle");
      setAgentJoined(false);
      setDispatchAccepted(false);
      setParticipantCount(0);
      setMessage("Call disconnected. Ready for another test.");
    });

    vapi.on("speech-start", () => {
      setMessage("EC Calling Agent is speaking.");
    });

    vapi.on("speech-end", () => {
      setMessage("Listening. You can speak now.");
    });

    vapi.on("call-start-progress", (event) => {
      if (event?.stage) {
        setMessage("Connecting to EC Calling Agent...");
      }
    });

    vapi.on("call-start-failed", (event) => {
      setStatus("error");
      setAgentJoined(false);
      setDispatchAccepted(false);
      setParticipantCount(0);
      setMessage(event?.error || "The EC Calling Agent call could not start.");
    });

    vapi.on("error", (error) => {
      setStatus("error");
      setAgentJoined(false);
      setDispatchAccepted(false);
      setParticipantCount(0);
      setMessage(getErrorMessage(error));
    });

    vapiRef.current = vapi;
    return vapi;
  }

  async function startCall() {
    if (status === "connecting" || status === "connected") return;
    setStatus("connecting");
    setMessage("Requesting microphone access...");
    setAgentJoined(false);
    setDispatchAccepted(false);
    setParticipantCount(0);

    try {
      const vapi = await getVapiClient();
      await vapi.start(VAPI_ASSISTANT_ID);
      setMessage("Connecting to EC Calling Agent...");
    } catch (error) {
      setStatus("error");
      setAgentJoined(false);
      setDispatchAccepted(false);
      setParticipantCount(0);
      setMessage(getErrorMessage(error));
    }
  }

  function endCall() {
    vapiRef.current?.stop?.();
    setStatus("idle");
    setMessage("Call disconnected. Ready for another test.");
    setParticipantCount(0);
    setAgentJoined(false);
    setDispatchAccepted(false);
  }

  return { status, message, roomName: "", participantCount, agentJoined, dispatchAccepted, startCall, endCall, audioRef };
}

function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <img src="/brand/ethikcorp-logo-blue.png" alt="EthikCorp" />
        <button type="button" aria-label="Collapse menu">
          <Grid2X2 size={18} />
        </button>
      </div>
      <nav className="side-nav" aria-label="Dashboard sections">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              className={activePage === item.id ? "nav-item active" : "nav-item"}
              onClick={() => setActivePage(item.id)}
            >
              <Icon size={20} />
              <span>
                <strong>{item.label}</strong>
                <small>{item.hint}</small>
              </span>
              {item.count && <em>{item.count}</em>}
            </button>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <span className="avatar">EC</span>
        <div>
          <strong>EthikCorp</strong>
          <small>EC Calling Agent</small>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ activePage, setActivePage, openCall }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const titles = {
    overview: ["Home Page", "Voice agent analytics at a glance"],
    conversations: ["Conversation", "Past calls and transcript review"],
    leads: ["Lead Management", "Client information captured by the AI agent"],
    test: ["Test Call", "Live EC Calling Agent quality check"],
  };
  const [title, subtitle] = titles[activePage];

  useEffect(() => {
    setMenuOpen(false);
  }, [activePage]);

  return (
    <header className="topbar">
      <div className="mobile-topbar-brand">
        <button type="button" aria-label="Go to Home Page" onClick={() => setActivePage("overview")}>
          <img src="/brand/ethikcorp-logo-blue.png" alt="EthikCorp" />
        </button>
      </div>
      <div className="topbar-title">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="mobile-topbar-controls">
        <button
          type="button"
          className="mobile-call-trigger"
          aria-label="Open EC Calling Agent test widget"
          onClick={() => {
            setMenuOpen(false);
            openCall();
          }}
        >
          <PhoneCall size={20} />
        </button>
        <div className="mobile-menu-wrap">
          <button
            type="button"
            className={menuOpen ? "mobile-menu-trigger open" : "mobile-menu-trigger"}
            aria-label="Open dashboard menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-dashboard-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Grid2X2 size={20} />
          </button>
          {menuOpen && (
            <nav id="mobile-dashboard-menu" className="mobile-menu-panel" aria-label="Mobile dashboard sections">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={activePage === item.id ? "active" : ""}
                    onClick={() => setActivePage(item.id)}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      </div>
      <div className="topbar-actions">
        <label className="search-box">
          <Search size={18} />
          <input placeholder="Search leads, calls, transcripts" />
        </label>
        <span className="status-pill"><span /> AI Live</span>
        <span className="latency-pill"><Zap size={15} /> 308ms</span>
        <button type="button" aria-label="Notifications"><Bell size={18} /></button>
        <span className="avatar top">EC</span>
      </div>
    </header>
  );
}

function OverviewPage() {
  return (
    <section className="dashboard-page">
      <div className="mobile-overview-heading">
        <h1>Voice agent Analytics</h1>
      </div>
      <div className="report-row">
        <p>Reporting window <strong>July 2026</strong> · UAE time zone</p>
        <div className="period-toggle">
          {["Today", "Week", "Month", "Quarter", "Year"].map((item, index) => (
            <button className={index === 0 ? "active" : ""} type="button" key={item}>{item}</button>
          ))}
        </div>
      </div>
      <div className="metric-grid">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <article className={`metric-card ${metric.tone}`} key={metric.label}>
              <div>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <small>{metric.delta}</small>
              </div>
              <Icon size={24} />
            </article>
          );
        })}
      </div>
      <div className="overview-grid">
        <article className="panel large">
          <PanelTitle title="Call Volume" subtitle="Inbound AI agent calls over time" />
          <LineChart />
        </article>
        <article className="panel action-queue">
          <PanelTitle title="Action Queue" subtitle="Items needing human follow-up" />
          {[
            ["High", "Retail transformation proposal requested", "Transformation · due 21m"],
            ["High", "Training quote for 40 managers", "Corporate Training · due 43m"],
            ["Medium", "Hospitality guest journey callback", "Hospitality · due 1h"],
          ].map(([priority, title, meta]) => (
            <div className="queue-item" key={title}>
              <span className={priority.toLowerCase()} />
              <div><strong>{title}</strong><small>{meta}</small></div>
              <em>{priority}</em>
            </div>
          ))}
        </article>
      </div>
    </section>
  );
}

function PanelTitle({ title, subtitle }) {
  return (
    <div className="panel-title">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

function LineChart() {
  const series = [
    "M 0 170 C 110 120, 170 190, 260 130 S 420 110, 500 138 S 650 98, 760 140 S 860 105, 920 55",
    "M 0 205 C 130 188, 190 208, 280 181 S 430 170, 530 184 S 660 160, 760 190 S 850 178, 920 154",
    "M 0 228 C 140 210, 190 236, 285 214 S 455 206, 535 218 S 670 194, 775 220 S 850 214, 920 199",
  ];
  return (
    <div className="chart-wrap" aria-label="Call volume chart">
      <svg viewBox="0 0 960 270" role="img">
        {[0, 1, 2, 3].map((n) => <line key={n} x1="0" x2="960" y1={55 + n * 58} y2={55 + n * 58} />)}
        <path className="area" d={`${series[0]} L 920 270 L 0 270 Z`} />
        <path className="orange-line" d={series[0]} />
        <path className="blue-line" d={series[1]} />
        <path className="cyan-line" d={series[2]} />
      </svg>
      <div className="chart-days">{["Jun 28", "Jun 29", "Jun 30", "Jul 1", "Jul 2", "Jul 3", "Jul 4"].map((d) => <span key={d}>{d}</span>)}</div>
    </div>
  );
}

function FunnelList() {
  const items = [
    ["Calls received", "186", "100%", "#25A9DA"],
    ["AI answered", "178", "95.6%", "#325A9F"],
    ["Lead captured", "62", "33.3%", "#20B486"],
    ["Human follow-up", "18", "9.7%", "#8B5CF6"],
    ["Dropped by AI", "11", "5.9%", "#F59E0B"],
    ["Dropped by customer", "39", "21.0%", "#EF4444"],
  ];
  return (
    <div className="funnel-list">
      {items.map(([label, value, pct, color]) => (
        <div key={label}>
          <span><strong>{label}</strong><em>{value} ({pct})</em></span>
          <i><b style={{ width: pct, background: color }} /></i>
        </div>
      ))}
    </div>
  );
}

function BarMix() {
  const items = [
    ["Website", 88, "#25A9DA"],
    ["Direct", 64, "#325A9F"],
    ["WhatsApp", 42, "#21B486"],
    ["Campaigns", 31, "#F59E0B"],
    ["Referral", 24, "#8B5CF6"],
  ];
  return (
    <div className="bar-mix">
      {items.map(([label, value, color]) => (
        <div key={label}>
          <b style={{ height: `${value}%`, background: color }} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function ConversationsPage({ selectedConversation, setSelectedConversation }) {
  return (
    <section className="conversation-layout">
      <aside className="conversation-list">
        <div className="filter-row">
          {["All", "Voice", "Qualified"].map((label, index) => <button className={index === 0 ? "active" : ""} type="button" key={label}>{label}</button>)}
        </div>
        <div className="mini-stats"><span><strong>18</strong> Open</span><span><strong>7</strong> Unread</span></div>
        {conversations.map((item) => (
          <button
            type="button"
            className={selectedConversation.id === item.id ? "conversation-card active" : "conversation-card"}
            key={item.id}
            onClick={() => setSelectedConversation(item)}
          >
            <span><strong>{item.name}</strong><em>{item.time}</em></span>
            <small>{item.channel} · {item.status}</small>
            <p>{item.summary}</p>
          </button>
        ))}
      </aside>
      <article className="transcript-panel">
        <header>
          <div>
            <h2>{selectedConversation.name} - Customer Journey</h2>
            <p>{selectedConversation.company} · {selectedConversation.phone}</p>
          </div>
          <div><button type="button">Assign</button><button type="button">Mark Resolved</button></div>
        </header>
        <div className="transcript-stream">
          {selectedConversation.transcript.map(([speaker, text], index) => (
            <div className="transcript-line" key={`${speaker}-${index}`}>
              <span className={speaker === "AI Agent" ? "ai" : "customer"}>{speaker === "AI Agent" ? <Bot size={18} /> : <UserRound size={18} />}</span>
              <div>
                <strong>{speaker}<em>{index + 1} min</em></strong>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
        <footer className="reply-bar">
          <input placeholder="Internal note or follow-up message..." />
          <button type="button">Save Note</button>
        </footer>
      </article>
    </section>
  );
}

function LeadsPage() {
  const [selectedLead, setSelectedLead] = useState(leads[0]);

  return (
    <section className="leads-page">
      <div className="lead-toolbar">
        <label className="lead-search"><Search size={17} /><input placeholder="Search by name, place, phone, email, requirement" /></label>
        {["All Status", "New", "Qualified", "Training", "Callback"].map((item, index) => <button className={index === 0 ? "active" : ""} type="button" key={item}>{item}</button>)}
        <button type="button" className="add-lead"><Plus size={17} /> Add Lead</button>
      </div>
      <div className="lead-summary">
        <span><strong>12</strong> Total</span>
        <span><strong>5</strong> Qualified</span>
        <span><strong>3</strong> Training</span>
        <span><strong>4</strong> Callback</span>
      </div>
      <div className="mobile-lead-workspace">
        <div className="mobile-lead-list" aria-label="Captured leads">
          {leads.map((lead) => (
            <button
              type="button"
              className={selectedLead.phone === lead.phone ? "mobile-lead-row active" : "mobile-lead-row"}
              key={lead.phone}
              onClick={() => setSelectedLead(lead)}
            >
              <span>
                <strong>{lead.name}</strong>
                <small>{lead.phone}</small>
                <em>{lead.status}</em>
              </span>
            </button>
          ))}
        </div>
        <article className="mobile-lead-detail">
          <header>
            <strong>{selectedLead.name}</strong>
            <span className={`lead-status ${selectedLead.status.toLowerCase()}`}>{selectedLead.status}</span>
          </header>
          <dl>
            <div><dt>Place</dt><dd>{selectedLead.place}</dd></div>
            <div><dt>Calling Number</dt><dd>{selectedLead.phone}</dd></div>
            <div><dt>Email</dt><dd>{selectedLead.email}</dd></div>
            <div><dt>Requirement</dt><dd>{selectedLead.requirement}</dd></div>
            <div><dt>Score</dt><dd>{selectedLead.score}</dd></div>
          </dl>
        </article>
      </div>
      <div className="table-panel">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Place</th>
              <th>Calling Number</th>
              <th>Email</th>
              <th>Customer Requirement</th>
              <th>Status</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.phone}>
                <td><strong>{lead.name}</strong><small>{lead.source}</small></td>
                <td>{lead.place}</td>
                <td>{lead.phone}</td>
                <td>{lead.email}</td>
                <td>{lead.requirement}</td>
                <td><span className={`lead-status ${lead.status.toLowerCase()}`}>{lead.status}</span></td>
                <td><Score value={lead.score} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Score({ value }) {
  return <span className="score"><i><b style={{ width: `${value}%` }} /></i><strong>{value}</strong></span>;
}

function TestCallPage({ call }) {
  return (
    <section className="test-call-page">
      <article className="panel test-copy">
        <PanelTitle
          title="EC Calling Agent Test Console"
          subtitle="Click the Start Call button to initiate a live call. Your browser will request permission to access the microphone before the call begins."
        />
      </article>
      <PhoneMockup call={call} />
    </section>
  );
}

function PhoneMockup({ call }) {
  const connected = call.status === "connected";
  const connecting = call.status === "connecting";
  const waitingForAgent = connected && !call.agentJoined;
  return (
    <article className="phone-mock">
      <div className="phone-speaker" />
      <div className="phone-screen">
        <header>
          <span>EC Calling Agent</span>
          <small>{call.agentJoined ? "Agent live" : waitingForAgent ? "Waiting for agent" : connecting ? "Connecting" : "Ready to test"}</small>
        </header>
        <div className={`pulse-orb ${call.agentJoined ? "connected" : ""}`}>
          {connected ? <Mic size={48} /> : <Phone size={48} />}
        </div>
        <div className="call-readout">
          <strong>{call.agentJoined ? "EC agent answered" : waitingForAgent ? "Room live, awaiting agent" : connecting ? "Starting secure room" : "Tap call to start"}</strong>
          <p>{call.message}</p>
          {call.roomName && <small>Room: {call.roomName}</small>}
          {connected && <small>Participants: {call.participantCount}</small>}
          {connected && <small>Dispatch: {call.dispatchAccepted ? "accepted by worker" : "waiting for worker"}</small>}
        </div>
        <div ref={call.audioRef} className="remote-audio" aria-live="polite" />
        <div className="phone-actions">
          <button type="button" className="call-start" disabled={connecting || connected} onClick={call.startCall}>
            <PhoneCall size={22} />
            Start Call
          </button>
          <button type="button" className="call-end" disabled={!connected && !connecting} onClick={call.endCall}>
            <PhoneOff size={22} />
            Disconnect
          </button>
        </div>
      </div>
    </article>
  );
}

function FloatingCallWidget({ isOpen, setIsOpen, call }) {
  const connecting = call.status === "connecting";
  const connected = call.status === "connected";

  return (
    <>
      <button className="floating-call" type="button" aria-label="Open live test call" onClick={() => setIsOpen(true)}>
        <PhoneForwarded size={27} />
      </button>
      {isOpen && (
        <div className="call-modal-backdrop" role="dialog" aria-modal="true" aria-label="Live test call popup">
          <div className="call-modal call-widget-phone" aria-label="EC Calling Agent test phone">
            <button className="modal-close" type="button" aria-label="Close popup" onClick={() => setIsOpen(false)}><X size={20} /></button>
            <div className="call-widget-speaker" />
            <div className="call-widget-screen">
              <header>
                <span>EC Calling Agent</span>
                <small>Ready to test</small>
              </header>
              <div className="call-widget-orb">
                <Phone size={34} />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={call.startCall} disabled={connecting || connected}>
                  <PhoneCall size={18} /> Start Call
                </button>
                <button type="button" className="secondary" onClick={call.endCall} disabled={!connected && !connecting}>
                  <MicOff size={18} /> Disconnect
                </button>
              </div>
            </div>
            <div ref={call.audioRef} className="remote-audio" />
          </div>
        </div>
      )}
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
