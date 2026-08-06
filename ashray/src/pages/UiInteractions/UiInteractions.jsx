import { useEffect, useRef } from "react";
import "./UiInteractions.css";

export default function UiInteractions() {
  const erToggleRef = useRef(null);
  const exitSliderRef = useRef(null);
  const exitValRef = useRef(null);

  useEffect(() => {
    const gsap = window.gsap;
    if (!gsap) return undefined;

    const erToggle = erToggleRef.current;
    const exitSlider = exitSliderRef.current;
    const exitVal = exitValRef.current;

    let exitTs = 2.5;

    const onSliderInput = () => {
      exitTs = parseFloat(exitSlider.value);
      exitVal.textContent = exitTs + "×";
    };
    exitSlider.addEventListener("input", onSliderInput);

    const er = (val) => (erToggle.checked ? val || true : false);

    // ══════════════════════════════════════
    // Button — big elastic scale
    // ══════════════════════════════════════
    let btnTl;
    const hoverBtn = document.getElementById("uiHoverBtn");

    const initBtn = () => {
      if (btnTl) btnTl.kill();
      gsap.set(hoverBtn, { clearProps: "all" });
      btnTl = gsap
        .timeline({ paused: true })
        .to(
          hoverBtn,
          {
            scale: 1.35,
            duration: 1.2,
            ease: "elastic.out(1.2, 0.3)",
            easeReverse: er("power2.out"),
          },
          0
        );
    };
    initBtn();

    const onHoverEnter = () => btnTl.timeScale(1).play();
    const onHoverLeave = () =>
      btnTl.timeScale(erToggle.checked ? exitTs : 1).reverse();
    hoverBtn.addEventListener("mouseenter", onHoverEnter);
    hoverBtn.addEventListener("mouseleave", onHoverLeave);

    // ══════════════════════════════════════
    // Dropdown — elastic panel, elastic arrow, stagger
    // ══════════════════════════════════════
    let ddOpen = false;
    let ddTl;
    const ddMenu = document.getElementById("uiDropdownMenu");
    const ddTrigger = document.getElementById("uiDropdownTrigger");
    const ddArrow = document.getElementById("uiDdArrow");

    const initDD = () => {
      if (ddTl) ddTl.kill();
      gsap.set(ddMenu, { autoAlpha: 0, yPercent: -30, scale: 0.7 });
      gsap.set(ddArrow, { rotation: 0 });
      gsap.set(".ui-dd-item", { opacity: 1, x: 0 });
      ddMenu.classList.remove("open");
      ddOpen = false;

      ddTl = gsap
        .timeline({ paused: true })
        .to(
          ddArrow,
          {
            rotation: 180,
            duration: 0.5,
            ease: "elastic.out(1, 0.45)",
            easeReverse: er("power2.inOut"),
          },
          0
        )
        .to(
          ddMenu,
          {
            autoAlpha: 1,
            yPercent: 0,
            scale: 1,
            duration: 0.55,
            ease: "elastic.out(1, 0.5)",
            easeReverse: er("power3.out"),
          },
          0
        )
        .from(
          ".ui-dd-item",
          {
            opacity: 0,
            x: -20,
            duration: 0.35,
            ease: "back.out(2)",
            easeReverse: er("power2.out"),
            stagger: 0.04,
          },
          0.06
        );
    };
    initDD();

    const closeDD = () => {
      if (!ddOpen) return;
      ddOpen = false;
      ddTl.eventCallback("onReverseComplete", () =>
        ddMenu.classList.remove("open")
      );
      ddTl.timeScale(erToggle.checked ? Math.max(exitTs, 3) : 1).reverse();
    };

    const onTriggerClick = (e) => {
      e.stopPropagation();
      ddOpen = !ddOpen;
      if (ddOpen) {
        ddMenu.classList.add("open");
        ddTl.timeScale(1).play();
      } else {
        closeDD();
      }
    };
    const onDocClick = () => closeDD();
    const ddItems = Array.from(document.querySelectorAll(".ui-dd-item"));
    const onItemClick = (e) => {
      e.stopPropagation();
      closeDD();
    };
    ddTrigger.addEventListener("click", onTriggerClick);
    document.addEventListener("click", onDocClick);
    ddItems.forEach((el) => el.addEventListener("click", onItemClick));

    // ══════════════════════════════════════
    // Tooltip — elastic pop, circle pulse
    // ══════════════════════════════════════
    let tipTl;
    const tipBubble = document.getElementById("uiTooltipBubble");
    const tipWrap = document.getElementById("uiTooltipWrap");
    const tipTarget = document.getElementById("uiTooltipTarget");

    const initTip = () => {
      if (tipTl) tipTl.kill();
      gsap.set(tipBubble, { autoAlpha: 0, y: 14, scale: 0.4 });
      gsap.set(tipTarget, { scale: 1 });

      tipTl = gsap
        .timeline({ paused: true })
        .to(
          tipBubble,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "elastic.out(1.2, 0.3)",
            easeReverse: er("power3.in"),
          },
          0
        )
        .to(
          tipTarget,
          {
            scale: 1.3,
            duration: 0.8,
            ease: "elastic.out(1.2, 0.3)",
            easeReverse: er("power3.in"),
          },
          0
        );
    };
    initTip();

    const onTipEnter = () => tipTl.timeScale(1).play();
    const onTipLeave = () =>
      tipTl.timeScale(erToggle.checked ? exitTs : 1).reverse();
    tipWrap.addEventListener("mouseenter", onTipEnter);
    tipWrap.addEventListener("mouseleave", onTipLeave);

    // ══════════════════════════════════════
    // Reinit on toggle
    // ══════════════════════════════════════
    const onErChange = () => {
      initBtn();
      initDD();
      initTip();
    };
    erToggle.addEventListener("change", onErChange);

    return () => {
      exitSlider.removeEventListener("input", onSliderInput);
      erToggle.removeEventListener("change", onErChange);
      hoverBtn.removeEventListener("mouseenter", onHoverEnter);
      hoverBtn.removeEventListener("mouseleave", onHoverLeave);
      ddTrigger.removeEventListener("click", onTriggerClick);
      document.removeEventListener("click", onDocClick);
      ddItems.forEach((el) => el.removeEventListener("click", onItemClick));
      tipWrap.removeEventListener("mouseenter", onTipEnter);
      tipWrap.removeEventListener("mouseleave", onTipLeave);
      [btnTl, ddTl, tipTl].forEach((t) => t && t.kill());
    };
  }, []);

  return (
    <div className="ui-demo">
      <h1>easeReverse - UI interactions</h1>
      <p className="ui-demo__subtitle">
        Toggle easeReverse off to feel how awkward more expressive eases like{" "}
        <code>elastic</code> and <code>back</code> can feel in reverse and how{" "}
        <code>easeReverse</code> and <code>timeScale</code> can help to smooth
        out the exit.
      </p>

      <div className="ui-demo__toggle-bar">
        <input type="checkbox" id="uiErToggle" ref={erToggleRef} defaultChecked />
        <label htmlFor="uiErToggle">
          <code>easeReverse</code>
        </label>
        <span className="ui-demo__exit-label">exit speed</span>
        <input
          type="range"
          id="uiExitSlider"
          ref={exitSliderRef}
          min="1"
          max="5"
          step="0.5"
          defaultValue="2.5"
        />
        <span ref={exitValRef} className="ui-demo__exit-val">
          2.5×
        </span>
      </div>

      <div className="ui-demo__demos">
        <div className="ui-demo__card">
          <span className="ui-demo__label">Button hover</span>
          <button className="ui-demo__hover-btn" id="uiHoverBtn">
            Hover me
          </button>
        </div>

        <div className="ui-demo__card">
          <span className="ui-demo__label">Dropdown</span>
          <div className="ui-demo__dropdown-wrap">
            <button className="ui-demo__dropdown-trigger" id="uiDropdownTrigger">
              Options
              <svg
                id="uiDdArrow"
                className="ui-demo__dd-arrow"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="ui-demo__dropdown-menu" id="uiDropdownMenu">
              <div className="ui-demo__dropdown-item ui-dd-item">Profile</div>
              <div className="ui-demo__dropdown-item ui-dd-item">Settings</div>
              <div className="ui-demo__dropdown-item ui-dd-item">Logout</div>
            </div>
          </div>
        </div>

        <div className="ui-demo__card">
          <span className="ui-demo__label">Tooltip</span>
          <div className="ui-demo__tooltip-wrap" id="uiTooltipWrap">
            <div className="ui-demo__tooltip-target" id="uiTooltipTarget">
              ?
            </div>
            <div className="ui-demo__tooltip-bubble" id="uiTooltipBubble">
              Handy little tooltip
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
