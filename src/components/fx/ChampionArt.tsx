export const ChampionArt = () => (
  <svg
    className="champ"
    viewBox="0 0 600 940"
    role="img"
    aria-label="Armoured champion holding a greatsword"
    preserveAspectRatio="xMidYMax meet"
  >
    <defs>
      <radialGradient id="champHalo" cx="50%" cy="34%" r="52%">
        <stop offset="0%" stopColor="#ff6a3d" stopOpacity="0.78" />
        <stop offset="42%" stopColor="#ff3d23" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#ff3d23" stopOpacity="0" />
      </radialGradient>

      <linearGradient id="champCape" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3a1108" />
        <stop offset="52%" stopColor="#1a0a07" />
        <stop offset="100%" stopColor="#07080b" />
      </linearGradient>

      <linearGradient id="champBody" x1="0.1" y1="0" x2="0.9" y2="1">
        <stop offset="0%" stopColor="#252c3b" />
        <stop offset="46%" stopColor="#131822" />
        <stop offset="100%" stopColor="#080a0e" />
      </linearGradient>

      <linearGradient id="champPlate" x1="0.15" y1="0" x2="0.85" y2="1">
        <stop offset="0%" stopColor="#38414f" />
        <stop offset="50%" stopColor="#1b212c" />
        <stop offset="100%" stopColor="#0b0d12" />
      </linearGradient>

      <linearGradient id="champBlade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#5d6577" />
        <stop offset="34%" stopColor="#f4f1ea" />
        <stop offset="56%" stopColor="#cfd4dd" />
        <stop offset="100%" stopColor="#434b5b" />
      </linearGradient>

      <linearGradient id="champGleam" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="46%" stopColor="#ffffff" stopOpacity="0.92" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>

      <radialGradient id="champImpact" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffb08a" stopOpacity="0.85" />
        <stop offset="34%" stopColor="#ff3d23" stopOpacity="0.44" />
        <stop offset="100%" stopColor="#ff3d23" stopOpacity="0" />
      </radialGradient>

      <clipPath id="champBladeClip">
        <path d="M270 548 L330 548 L322 806 L300 884 L278 806 Z" />
      </clipPath>
    </defs>

    <circle className="champ__halo" cx="300" cy="300" r="290" fill="url(#champHalo)" />

    <g className="champ__figure">
      <g className="champ__cape">
        <path
          d="M252 272 C198 306 166 388 160 478 C154 580 168 688 142 802 C186 782 218 728 236 664 C250 614 254 540 256 474 Z"
          fill="url(#champCape)"
        />
        <path
          d="M348 272 C412 304 448 396 458 508 C468 620 452 706 482 824 C434 800 400 736 382 664 C366 600 356 520 350 466 Z"
          fill="url(#champCape)"
        />
        <path
          d="M348 272 C412 304 448 396 458 508 C468 620 452 706 482 824 C462 812 446 792 432 766 C438 660 430 552 404 460 C388 402 368 330 348 272 Z"
          fill="#ff3d23"
          opacity="0.16"
        />
      </g>

      <path
        d="M240 266 C194 268 166 298 160 338 C156 368 166 392 186 406 L228 380 C217 350 221 314 242 292 Z"
        fill="url(#champPlate)"
      />
      <path
        d="M360 266 C406 268 434 298 440 338 C444 368 434 392 414 406 L372 380 C383 350 379 314 358 292 Z"
        fill="url(#champPlate)"
      />

      <path
        d="M196 404 C200 440 216 472 242 492 L278 512 L292 478 L254 458 C236 446 224 426 220 404 Z"
        fill="url(#champBody)"
      />
      <path
        d="M404 404 C400 440 384 472 358 492 L322 512 L308 478 L346 458 C364 446 376 426 380 404 Z"
        fill="url(#champBody)"
      />

      <path
        d="M252 266 L348 266 C362 266 372 278 372 294 L366 406 C364 434 352 458 334 474 L300 494 L266 474 C248 458 236 434 234 406 L228 294 C228 278 238 266 252 266 Z"
        fill="url(#champPlate)"
      />
      <path
        d="M300 286 L336 304 L330 386 C328 408 318 426 300 440 C282 426 272 408 270 386 L264 304 Z"
        fill="#0a0d13"
        opacity="0.72"
      />
      <path d="M300 300 L300 436" stroke="#ff3d23" strokeWidth="2.5" opacity="0.55" />

      <path
        d="M246 476 L354 476 L370 566 L230 566 Z"
        fill="url(#champBody)"
      />
      <path d="M252 566 L292 566 L288 706 L296 846 L246 846 L244 706 Z" fill="url(#champBody)" />
      <path d="M308 566 L348 566 L356 706 L354 846 L304 846 L312 706 Z" fill="url(#champBody)" />
      <path d="M236 830 L300 830 L306 868 L228 868 Z" fill="#0a0d13" />
      <path d="M300 830 L364 830 L372 868 L294 868 Z" fill="#0a0d13" />

      <path
        d="M268 112 C242 86 214 74 190 80 C212 96 228 116 238 140 Z"
        fill="url(#champPlate)"
      />
      <path
        d="M332 112 C358 86 386 74 410 80 C388 96 372 116 362 140 Z"
        fill="url(#champPlate)"
      />
      <path
        d="M300 98 C268 98 246 120 244 154 L240 198 C239 216 249 230 264 236 L300 252 L336 236 C351 230 361 216 360 198 L356 154 C354 120 332 98 300 98 Z"
        fill="url(#champPlate)"
      />
      <path
        d="M262 174 L293 181 L289 200 L259 192 Z"
        className="champ__visor"
        fill="#ff3d23"
      />
      <path
        d="M338 174 L307 181 L311 200 L341 192 Z"
        className="champ__visor"
        fill="#ff3d23"
      />
      <path d="M284 210 L316 210 L310 240 L290 240 Z" fill="#0a0d13" opacity="0.8" />

      <path
        d="M256 268 C248 342 244 420 248 494 L236 492 C230 414 234 334 244 266 Z"
        fill="#ff3d23"
        opacity="0.5"
      />
      <path
        d="M344 268 C352 342 356 420 352 494 L364 492 C370 414 366 334 356 266 Z"
        fill="#ff6a3d"
        opacity="0.42"
      />

      <g className="champ__sword">
        <path d="M286 428 L314 428 L318 450 L282 450 Z" fill="url(#champPlate)" />
        <path d="M289 450 L311 450 L311 518 L289 518 Z" fill="#14181f" />
        <path d="M289 462 L311 462 M289 480 L311 480 M289 498 L311 498" stroke="#3c4557" strokeWidth="3" />
        <path
          d="M206 518 L394 518 L400 538 L356 548 L244 548 L200 538 Z"
          fill="url(#champPlate)"
        />
        <path d="M244 522 L356 522 L352 534 L248 534 Z" fill="#ff3d23" opacity="0.62" />
        <path d="M270 548 L330 548 L322 806 L300 884 L278 806 Z" fill="url(#champBlade)" />
        <path d="M298 552 L302 552 L301 812 L300 852 L299 812 Z" fill="#0d1017" opacity="0.5" />
        <g clipPath="url(#champBladeClip)">
          <rect className="champ__gleam" x="250" y="-260" width="110" height="260" fill="url(#champGleam)" />
        </g>
      </g>
    </g>

    <ellipse className="champ__impact" cx="300" cy="882" rx="210" ry="34" fill="url(#champImpact)" />
    <g className="champ__cracks" stroke="#ff3d23" strokeWidth="2.5" fill="none">
      <path d="M300 884 L206 906" opacity="0.7" />
      <path d="M300 884 L394 906" opacity="0.7" />
      <path d="M300 884 L246 920" opacity="0.45" />
      <path d="M300 884 L358 918" opacity="0.45" />
      <path d="M300 884 L150 892" opacity="0.3" />
      <path d="M300 884 L452 894" opacity="0.3" />
    </g>
  </svg>
)
