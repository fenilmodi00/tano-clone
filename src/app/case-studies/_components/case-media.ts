/**
 * Case-study media inventory, derived from the four captured brand pages and
 * `vids/fileassets.json`. Every path is local: the films live in
 * `public/sites/tano/media/`, the reel posters/avatars/clips in
 * `public/sites/tano/extras/`.
 *
 * Source reel order is preserved (the ring repeats the same 9-10 films five
 * times). HelloFresh's three films are signed Mux assets and are deliberately
 * not mirrored; they keep their source poster and gate.
 */

export type CaseFilm = {
  /** Stable identity for DOM state (`data-case-film`). */
  readonly id: string;
  readonly title: string;
  /** Local mp4; `null` for a private film that only has a gate + poster. */
  readonly src: string | null;
  readonly poster: string;
  /** Shown after the gate is submitted, replacing the form. */
  readonly note?: string;
};

export type CaseReelFilm = {
  readonly handle: string;
  readonly src: string;
  readonly poster: string;
  /** `null` where the source renders the bare gradient plate. */
  readonly avatar: string | null;
};

export type CaseMedia = {
  readonly films: readonly CaseFilm[];
  readonly reels: readonly CaseReelFilm[];
};

const PRIVATE_NOTE =
  "This film is served from a signed Mux playback ID, so the private master is not mirrored in this archive. The poster and the work-email gate are preserved; submitting the form stays on this page and sends nothing.";

export const CASE_MEDIA: Readonly<Record<string, CaseMedia>> = {
  "case-studies": {
    films: [],
    reels: [
      {
        handle: "@lucindachapmanofficial",
        src: "/sites/tano/extras/1eabace16b5517e329d4a165bf497036ebacf433.mp4",
        poster: "/sites/tano/extras/d5a0904e3b8a8b1c3dba9be9378b9898e11690f6-432x768.jpg",
        avatar: "/sites/tano/extras/8f0c2043aa623794bbc097b06621f695b2f3a50f-320x320.jpg",
      },
      {
        handle: "@reginafoster.us",
        src: "/sites/tano/extras/4f0e11e475354d851033682128db25076b9c26da.mp4",
        poster: "/sites/tano/extras/7740af5568f58a59a00d1e5f9187ca77bab6931d-432x768.jpg",
        avatar: "/sites/tano/extras/b109a8f03a5379def8e4f3199bb4207951f2d3cd-100x100.jpg",
      },
      {
        handle: "@jessebuck_",
        src: "/sites/tano/extras/341d6722af915dad4975ba2404e7a3eea2f698aa.mp4",
        poster: "/sites/tano/extras/a69bf16c0a98274128daf706ce6ce006405cd062-432x768.jpg",
        avatar: "/sites/tano/extras/d3cfed4caf164ebf2003f93bce52c8cf0c547ca9-320x320.jpg",
      },
      {
        handle: "@cherrrymyint",
        src: "/sites/tano/extras/fe59c650981aa627640c3086c54f041e305fdfaf.mp4",
        poster: "/sites/tano/extras/52a8b4b5ad338c3670a0e29e73e3e85c1677d125-432x768.jpg",
        avatar: "/sites/tano/extras/b62bb260dd3c078b7866eae084dd843488d7db9d-320x320.jpg",
      },
      {
        handle: "@daria_outfit",
        src: "/sites/tano/extras/33ff801828b672f4edcedb060dfb07f79056a56e.mp4",
        poster: "/sites/tano/extras/f47d9a08e48cc29adbf3a124126cd4b852aef76a-432x768.jpg",
        avatar: "/sites/tano/extras/fa1867bd9060097cd15d15de6ed0385f9149f99e-100x100.jpg",
      },
      {
        handle: "@its.mini.made",
        src: "/sites/tano/extras/68eab373c7d1ed20361d660bcc789e915d52aafc.mp4",
        poster: "/sites/tano/extras/eb531dbe7f7a87a288fb5b4f03e55ddd7679c68b-432x768.jpg",
        avatar: "/sites/tano/extras/a1181238e1f0258b88a52c64d2243d102d884e6a-100x100.jpg",
      },
      {
        handle: "@joannas.momlife",
        src: "/sites/tano/extras/f5c8934166ab7dc34ae26374b08faf1aebb3ee15.mp4",
        poster: "/sites/tano/extras/f3877c8f92f6dee87302f2929c693d8d65e6ad68-432x768.jpg",
        avatar: "/sites/tano/extras/b325d173c95c69ed072c7eface0c3839b456a71f-320x320.jpg",
      },
      {
        handle: "@livingwithtish",
        src: "/sites/tano/extras/35eb1acd3b60939ccccb48de2244ff4a8c95e801.mp4",
        poster: "/sites/tano/extras/1e3d0d61d57532500804fedefeb7f08f232073c4-432x768.jpg",
        avatar: "/sites/tano/extras/a82f84d4189eb553726bb74aeb3aa75db7511e31-320x320.jpg",
      },
    ],
  },
  "bloom-and-wild": {
    films: [
      {
        id: "bloom-and-wild-rebrand",
        title: "Bloom & Wild with Tano",
        src: "/sites/tano/media/bloom-and-wild-rebrand.mp4",
        poster: "/sites/tano/media/bloom-and-wild-film-poster.jpg",
      },
    ],
    reels: [
      {
        handle: "@helenxkarim",
        src: "/sites/tano/extras/2e9d02ccc7eb049d44d70f6fd750b7ef1cc3b320.mp4",
        poster: "/sites/tano/extras/f9b15a26367375be79b9220d8b3627c1beffb60b-432x768.jpg",
        avatar: "/sites/tano/extras/cebd83459edeea0973cf042cdd4126fc3945c8b6-320x320.jpg",
      },
      {
        handle: "@jadecrawfordtravels",
        src: "/sites/tano/extras/cba2364eca42fa08ecd0a29a4d293eb92e1b92ae.mp4",
        poster: "/sites/tano/extras/88c84235d8d36a3aece2e8ab4aa56b8b82c9a66a-432x768.jpg",
        avatar: "/sites/tano/extras/83bb37d381c6286a3bc0eb9a423b3261ab47f598-320x320.jpg",
      },
      {
        handle: "@katieannwilson",
        src: "/sites/tano/extras/27c383f65e8a1b8a8f2fb05e745282c7842d1625.mp4",
        poster: "/sites/tano/extras/7dba21a8fdc19467ae78b09eeae1ff48d4ccb27c-432x768.jpg",
        avatar: "/sites/tano/extras/bf5fdc030e5f715d6adaacde8549f9c56d4a6ca1-320x320.jpg",
      },
      {
        handle: "@hanna__salem",
        src: "/sites/tano/extras/a9b82c923368654af935bf2c0a01d5d687d523d1.mp4",
        poster: "/sites/tano/extras/42e18d1bbda263e6eb1fbf6c4e5d7fbe2540d083-432x768.jpg",
        avatar: "/sites/tano/extras/df5aa87a2203bcb7771759ac5208dc21b9e06e5d-320x320.jpg",
      },
      {
        handle: "@niamhamelia1",
        src: "/sites/tano/extras/62b2ce82f8c0e9368bdfe2e5210c7eb4aa87f99a.mp4",
        poster: "/sites/tano/extras/87605b4c6c15995128433040443deaa4fad5c74d-432x768.jpg",
        avatar: "/sites/tano/extras/d05d01d884999e55b4e38af2206dc6fa71b8792e-320x320.jpg",
      },
      {
        handle: "@nicoleinlondon",
        src: "/sites/tano/extras/42889107a760a0f05f49dc37da26323d18dcc782.mp4",
        poster: "/sites/tano/extras/c6d926b01528a7936e91b5ac4b1f7cf1ccc0cd4c-432x768.jpg",
        avatar: "/sites/tano/extras/ae780f6936d1155ee0d52d588f9e87df034f59e3-320x320.jpg",
      },
      {
        handle: "@annabellegiselle",
        src: "/sites/tano/extras/39c680f98a8d57274757ca89d2449438eec3ca31.mp4",
        poster: "/sites/tano/extras/f4645274602fc756faeada4977a8e55ee889546d-432x768.jpg",
        avatar: "/sites/tano/extras/62e9c29ea918fb9fad20906ef12818014c4d6488-320x320.jpg",
      },
      {
        handle: "@tilleeez",
        src: "/sites/tano/extras/6c2826b26d1e55bf55f5785ff25e3157909a5f4f.mp4",
        poster: "/sites/tano/extras/03087953f61467ac4d2710b93589cce6e39d8082-432x768.jpg",
        avatar: "/sites/tano/extras/c5e88929e468ff9b48fc2fb86ffd9945ce358ee4-320x320.jpg",
      },
      {
        handle: "@charhbooks",
        src: "/sites/tano/extras/74104196c1ef5e010755df38847b6d2ca4450565.mp4",
        poster: "/sites/tano/extras/f605e5f01d60ff92b6d23808383b7e6db3e5a4b1-432x768.jpg",
        avatar: "/sites/tano/extras/d21a5590745ed2cde87ce7bba0548ddd0b454035-320x320.jpg",
      },
      {
        handle: "@madelinejd",
        src: "/sites/tano/extras/a92444572252c58b07009f98b9421280d9a06b45.mp4",
        poster: "/sites/tano/extras/46003b9a90914a575e03e616beeddf9f64f2f087-432x768.jpg",
        avatar: "/sites/tano/extras/6efb9582bbb64f16c07a8d15166d858da01f18f7-320x320.jpg",
      },
    ],
  },
  hellofresh: {
    films: [
      {
        id: "hellofresh-cac",
        title: "HelloFresh on lowering CAC with creators",
        src: null,
        poster: "/sites/tano/media/hellofresh-cac-poster.webp",
        note: PRIVATE_NOTE,
      },
      {
        id: "hellofresh-process",
        title: "How Tano runs HelloFresh’s creator programme",
        src: null,
        poster: "/sites/tano/media/hellofresh-process-poster.webp",
        note: PRIVATE_NOTE,
      },
      {
        id: "hellofresh-ai-agents",
        title: "HelloFresh on working with Tano’s AI agents",
        src: null,
        poster: "/sites/tano/media/hellofresh-ai-agents-poster.webp",
        note: PRIVATE_NOTE,
      },
    ],
    reels: [
      {
        handle: "@taylorfrances_",
        src: "/sites/tano/extras/7aa6100cfee5a8b60e87bd522edc40f31167ae86.mp4",
        poster: "/sites/tano/extras/f648de543b554f293ebcb5c659496336baf94f34-432x768.jpg",
        avatar: "/sites/tano/extras/8b42ee15eb8df88966ed3fb0a20510a03bf059ba-320x320.jpg",
      },
      {
        handle: "@artbyronel",
        src: "/sites/tano/extras/69347bf8d47f386f5cfb62b3ad7474551b8f8a65.mp4",
        poster: "/sites/tano/extras/94ab3655e9b7e42dccf4ba00089ed945a49bcb34-432x768.jpg",
        avatar: "/sites/tano/extras/989b8a9b58507244b344a36eb66312b34b4955f4-320x320.jpg",
      },
      {
        handle: "@_baileymoorex",
        src: "/sites/tano/extras/42b6363dd2ec4d4c8304af9d2399aed89e57c5e9.mp4",
        poster: "/sites/tano/extras/d7a2bea7a1ad8ada7f918b3d9c664c48adbde0dd-432x768.jpg",
        avatar: "/sites/tano/extras/c016ef97ee3965df09be707bf9f7f7fef9fce96e-320x320.jpg",
      },
      {
        handle: "@rosieryan_x",
        src: "/sites/tano/extras/4258842bda7da4ea29306e2840dbad4e9237dc69.mp4",
        poster: "/sites/tano/extras/e80e16c458065123e2665ad321393ae094b4c243-432x768.jpg",
        avatar: "/sites/tano/extras/e35f15ce3b023b1ee1a27912cb42dca5826f957b-320x320.jpg",
      },
      {
        handle: "@olivialinch",
        src: "/sites/tano/extras/6e0d65570e932fbaa4767e76396d3dd5203f64c1.mp4",
        poster: "/sites/tano/extras/30ed0e350960312ee4cb246b6d850a43106f8e1f-432x768.jpg",
        avatar: null,
      },
      {
        handle: "@mary_h761",
        src: "/sites/tano/extras/16ee73cb9b376ef421e1230b8d553d1fce6fbd42.mp4",
        poster: "/sites/tano/extras/4ded2e171a2571b32910df90b96e8509130cdcc5-432x768.jpg",
        avatar: "/sites/tano/extras/04d33eacee17288a661e008961e4060255c7696d-320x320.jpg",
      },
      {
        handle: "@samanthajtarkowski",
        src: "/sites/tano/extras/efcc036598e0229f5c5f144d8ce0c82e67a16545.mp4",
        poster: "/sites/tano/extras/a4ccf7d0087c947da8e079a0fe63356481b37479-432x768.jpg",
        avatar: null,
      },
      {
        handle: "@erinmcclean1",
        src: "/sites/tano/extras/b64a719a8f954b8ef8f14483df383d8ab1b902d9.mp4",
        poster: "/sites/tano/extras/173fa74e29b3ca84565ed5176aca57771466b7cf-432x768.jpg",
        avatar: null,
      },
      {
        handle: "@snehasunny30_",
        src: "/sites/tano/extras/b21ff9714389709405fc8df6e72835c0e0ac10aa.mp4",
        poster: "/sites/tano/extras/cfd722a0f9d08cfaef1e18488e58ce117f48a356-432x768.jpg",
        avatar: null,
      },
      {
        handle: "@erinmcclean1",
        src: "/sites/tano/extras/c63b91686a43ebfb87c7cbf88122afc1dd67b49e.mp4",
        poster: "/sites/tano/extras/7679afe82f3203e927623f8e286c239fa46fa31d-432x768.jpg",
        avatar: null,
      },
    ],
  },
  papier: {
    films: [
      {
        id: "papier-case-study",
        title: "Papier Case Study",
        src: "/sites/tano/media/papier-case-study.mp4",
        poster: "/sites/tano/media/papier-case-film-poster.jpg",
      },
      {
        id: "papier-cpa",
        title: "How Papier cut its CPA with seeded creators",
        src: "/sites/tano/media/papier-cpa.mp4",
        poster: "/sites/tano/media/papier-cpa-film-poster.jpg",
      },
    ],
    reels: [
      {
        handle: "@thejackielin",
        src: "/sites/tano/extras/894fe59c6e35030325be14e9e345334f34ff6a5e.mp4",
        poster: "/sites/tano/extras/6eed065a00e30da60c8579c11cc47b25bf795203-432x768.jpg",
        avatar: null,
      },
      {
        handle: "@eleanorhudson_singer",
        src: "/sites/tano/extras/1b20b229e96d602fb47d994085e9cab53c346799.mp4",
        poster: "/sites/tano/extras/ad9bc5786c2a9190e45c3e1bf81cb2cbea2e1e55-432x768.jpg",
        avatar: "/sites/tano/extras/2e601b95d1425e0078f87ca0426a1dd4785dbe21-320x320.jpg",
      },
      {
        handle: "@mal_hoovs",
        src: "/sites/tano/extras/1ff7aa466da5c0e13894fba1ab26648e9638fa50.mp4",
        poster: "/sites/tano/extras/9912b0b031f23d9849b5011a85069cad7738e91d-432x768.jpg",
        avatar: "/sites/tano/extras/e9a34bd4e702ba62890206c0ac4bb895acad0da8-320x320.jpg",
      },
      {
        handle: "@chardonnayhanson",
        src: "/sites/tano/extras/7c5254f42122b7179b94a9e3d4264c2a1c54cd99.mp4",
        poster: "/sites/tano/extras/8b401c5228ae200bc46799905f547e025e9dd273-432x768.jpg",
        avatar: "/sites/tano/extras/58ab8d29e7fd1ec8653ba6af6cec9664ba9ffb7f-320x320.jpg",
      },
      {
        handle: "@miss_csw",
        src: "/sites/tano/extras/99c7cca1f5756b006efa992c647c75137df4248c.mp4",
        poster: "/sites/tano/extras/5dc4a7cc5a56b0543dcf9679cce1854a35e36fcb-432x768.jpg",
        avatar: "/sites/tano/extras/81fdd9376e4d4c24afc2bb2c283feef07000a202-320x320.jpg",
      },
      {
        handle: "@flowerb0x",
        src: "/sites/tano/extras/94f5a384f3f70472c7c35e387f6adc396a72b0a7.mp4",
        poster: "/sites/tano/extras/a9cacac5bbfc8840d3c00f1858c253c77184b400-432x768.jpg",
        avatar: null,
      },
      {
        handle: "@mikaellaaz",
        src: "/sites/tano/extras/bcdd1f33353d1418e99f8a47d9bf36754b051d3b.mp4",
        poster: "/sites/tano/extras/d8a9beeac2e29596897150704a71fab60f2f8eeb-432x768.jpg",
        avatar: "/sites/tano/extras/eae68e7336f6ed4116ecd4869a628c55d99b78ac-320x320.jpg",
      },
      {
        handle: "@bels.booktok1",
        src: "/sites/tano/extras/3fc4c50e73293b73cd5298cc9aefe5581193abb3.mp4",
        poster: "/sites/tano/extras/2741eaac214c0264c3c7f5691c92369da9b2a70b-432x768.jpg",
        avatar: "/sites/tano/extras/77fd9ba1e3a41148f675cc564ffed06a4de6668c-320x320.jpg",
      },
      {
        handle: "@ashley_dxb",
        src: "/sites/tano/extras/c9dcfeb70e7134784c574a97dc869e8eccc3cf65.mp4",
        poster: "/sites/tano/extras/3f0f1eb8aafab3e4a38a2922e7ef80abfccd2439-432x768.jpg",
        avatar: null,
      },
    ],
  },
  "skin-and-me": {
    films: [],
    reels: [
      {
        handle: "@noturbasicmama",
        src: "/sites/tano/extras/6167f632fcda34779b929736b0839c7854d50c80.mp4",
        poster: "/sites/tano/extras/71a9ec746156a8521744c0d1a062b003062e1e7d-432x768.jpg",
        avatar: "/sites/tano/extras/c2162cfb43ae8225b64cd35e40d4f8cf003c35fc-320x320.jpg",
      },
      {
        handle: "@getgorgeouswithme_ugc",
        src: "/sites/tano/extras/bcce8c01f3843d664ce4fb42b0314b363d3e2c93.mp4",
        poster: "/sites/tano/extras/b8d2d359ee2409aabbcadc6ceb9ee37f196cc7e3-432x768.jpg",
        avatar: "/sites/tano/extras/c771ed238fcfb8cbac30324b2feae311e4b67781-150x150.jpg",
      },
      {
        handle: "@elliegeorginateague",
        src: "/sites/tano/extras/fd00fae0c6e2af0c06d43935b5b8fc60eb443487.mp4",
        poster: "/sites/tano/extras/18fca7be61c25d5f5c0759a3d4b174ad14e4562f-432x768.jpg",
        avatar: "/sites/tano/extras/79905815df01a470b7e972fffc64b4915c65ebe1-320x320.jpg",
      },
      {
        handle: "@pietra.pilao",
        src: "/sites/tano/extras/e26259ab73dae8e23f6c18ebdf29ab6e34ab24ee.mp4",
        poster: "/sites/tano/extras/4946b71b42727695017bc1d6a538f847d5a4dcec-432x768.jpg",
        avatar: "/sites/tano/extras/eeb67cdf2243856bd7fccc82a41815f47ba34f7c-150x150.jpg",
      },
      {
        handle: "@amycatriona",
        src: "/sites/tano/extras/5794aec50dc1d0503384a794bbb2aa2ac69a3ce2.mp4",
        poster: "/sites/tano/extras/d8c2ced3ab390f131e2ced1ab20abd75c9dd0f62-432x768.jpg",
        avatar: "/sites/tano/extras/c3052609d58a8b4855d7aff10fe8516c4e8545c4-320x320.jpg",
      },
      {
        handle: "@demileebuchanan",
        src: "/sites/tano/extras/55cdf5f37a795b69ac4ae86741c2e3bf5e1e08d0.mp4",
        poster: "/sites/tano/extras/49efd0abf1db42c42d00a078934422ba96467727-432x768.jpg",
        avatar: "/sites/tano/extras/1ae71d46e3da28b75805feb033f039fb9ef1f479-320x320.jpg",
      },
      {
        handle: "@the.tradie.wife",
        src: "/sites/tano/extras/88aaa805dec2c4649a44768a61870e26de5bd65a.mp4",
        poster: "/sites/tano/extras/cd81d1d5b0b7696ca76a21d8b5560f745db45a5b-432x768.jpg",
        avatar: "/sites/tano/extras/7fcb2c8ef23f4a5cb7701d142ed7a4b726e0ef4a-150x150.jpg",
      },
      {
        handle: "@imjustimmy",
        src: "/sites/tano/extras/ead8f6a3370c4c6cca85e9a156089b6175447969.mp4",
        poster: "/sites/tano/extras/f6bee8f8f59df35fd6049bd696d227fad3253d2b-432x768.jpg",
        avatar: "/sites/tano/extras/34520a3b48db8a0b7e6f24176547fb9feb238fd9-150x150.jpg",
      },
      {
        handle: "@thecraftedstudio_soma",
        src: "/sites/tano/extras/ef1f8096e897cdf0f603e28157498106b4b7848b.mp4",
        poster: "/sites/tano/extras/1c7c424a5b8f65a718b3550acfbc8ee4a3e0fcfd-432x768.jpg",
        avatar: "/sites/tano/extras/8483a7ed1710e2689a59baf2bf12a484008d9fa5-150x150.jpg",
      },
      {
        handle: "@chaneljamesx",
        src: "/sites/tano/extras/e38863b03d3af6e770da004be12b1d3b8a6055c2.mp4",
        poster: "/sites/tano/extras/06ac15258097670a7c7aea0cf0e85be0421b914e-432x768.jpg",
        avatar: "/sites/tano/extras/d3ec77c754331ca03e064d69596dbb96574705bd-150x150.jpg",
      },
    ],
  },
};

export function caseMediaForPath(pathname: string): CaseMedia | null {
  if (/^\/case-studies\/?$/.test(pathname)) return CASE_MEDIA["case-studies"] ?? null;
  const match = /^\/case-studies\/([^/]+)\/?$/.exec(pathname);
  if (!match) return null;
  return CASE_MEDIA[match[1]] ?? null;
}
