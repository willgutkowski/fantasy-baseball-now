import { useState, useEffect, useRef, useCallback } from 'react';

import { useState, useEffect, useRef, useCallback } from "react";
const sget = async (k) => { try { if(window.storage){ const r = await window.storage.get(k, true); return r ? JSON.parse(r.value) : null; } return JSON.parse(localStorage.getItem('dd_'+k)||'null'); } catch { return null; } };
const sset = async (k, v) => { try { if(window.storage){ await window.storage.set(k, JSON.stringify(v), true); return; } localStorage.setItem('dd_'+k, JSON.stringify(v)); } catch {} };
const AVATARS = ["⚾","🧢","🏆","⚡","🔥","💎","🦅","🐉","🌟","🎯","🏹","🗡️"];
const COLORS  = ["#4a9eff","#e84545","#3dd68c","#f5c842","#ff7c3a","#c084fc","#fb7185","#34d399"];
const DSC = {
  hr:10, triple:8, double:5, single:3, rbi:3, run:2, bb_bat:2, sb:5,
  k_bat:-1, cs_bat:-1, hbp_bat:1, gidp:-1,
  ip:3, k_pit:2, er:-3, bb_pit:-1, win:10, save:10,
  qs:4, cg:3, cgso:5, nh:5, hbp_pit:-1,
  def_enabled:false, putout:0.5, assist:0.3, caught_stealing:2, double_play:1, error:-1,
};
const FALLBACK_GAMES = [
  { id:'g1', away:'NYY', home:'BOS', awayFull:'New York Yankees', homeFull:'Boston Red Sox', time:'7:10 PM ET', status:'scheduled',
    awaySP:{name:'Gerrit Cole',pos:'SP',hand:'R',era:'2.63'},
    homeSP:{name:'Chris Sale',pos:'SP',hand:'L',era:'3.12'},
    awayBullpen:{name:'NYY Bullpen',pos:'BULLPEN',pitchers:'Holmes (C), King, Trivino'},
    homeBullpen:{name:'BOS Bullpen',pos:'BULLPEN',pitchers:'Jansen (C), Whitlock, Martin'},
    awayLineup:[
      {name:'DJ LeMahieu',pos:'3B',bats:'R',avg:'.265',hr:12},{name:'Aaron Judge',pos:'RF',bats:'R',avg:'.311',hr:37},
      {name:'Anthony Rizzo',pos:'1B',bats:'L',avg:'.244',hr:15},{name:'Giancarlo Stanton',pos:'DH',bats:'R',avg:'.258',hr:24},
      {name:'Gleyber Torres',pos:'2B',bats:'R',avg:'.273',hr:14},{name:'Josh Donaldson',pos:'3B',bats:'R',avg:'.222',hr:8},
      {name:'Harrison Bader',pos:'CF',bats:'R',avg:'.259',hr:6},{name:'Jose Trevino',pos:'C',bats:'R',avg:'.243',hr:9},
      {name:'Isiah Kiner-Falefa',pos:'SS',bats:'R',avg:'.261',hr:3},
    ],
    homeLineup:[
      {name:'Alex Verdugo',pos:'LF',bats:'L',avg:'.261',hr:11},{name:'Rafael Devers',pos:'3B',bats:'L',avg:'.279',hr:22},
      {name:'Xander Bogaerts',pos:'SS',bats:'R',avg:'.307',hr:15},{name:'J.D. Martinez',pos:'DH',bats:'R',avg:'.288',hr:16},
      {name:'Trevor Story',pos:'2B',bats:'R',avg:'.238',hr:10},{name:'Franchy Cordero',pos:'1B',bats:'L',avg:'.246',hr:7},
      {name:'Kiké Hernández',pos:'CF',bats:'R',avg:'.251',hr:8},{name:'Christian Vázquez',pos:'C',bats:'R',avg:'.258',hr:6},
      {name:'Jarren Duran',pos:'RF',bats:'L',avg:'.246',hr:4},
    ],
    awayBench:[{name:'Matt Carpenter',pos:'BN',bats:'L',avg:'.305',hr:12},{name:'Tim Locastro',pos:'BN',bats:'R',avg:'.238',hr:2}],
    homeBench:[{name:'Rob Refsnyder',pos:'BN',bats:'R',avg:'.271',hr:3},{name:'Reese McGuire',pos:'BN',bats:'L',avg:'.241',hr:4}],
  },
  { id:'g2', away:'LAD', home:'SF', awayFull:'Los Angeles Dodgers', homeFull:'San Francisco Giants', time:'9:45 PM ET', status:'scheduled',
    awaySP:{name:'Clayton Kershaw',pos:'SP',hand:'L',era:'2.49'},
    homeSP:{name:'Logan Webb',pos:'SP',hand:'R',era:'2.90'},
    awayBullpen:{name:'LAD Bullpen',pos:'BULLPEN',pitchers:'Phillips (C), Vesia, Treinen'},
    homeBullpen:{name:'SF Bullpen',pos:'BULLPEN',pitchers:'Doval (C), Rogers, McGee'},
    awayLineup:[
      {name:'Mookie Betts',pos:'RF',bats:'R',avg:'.295',hr:28},{name:'Trea Turner',pos:'SS',bats:'R',avg:'.298',hr:21},
      {name:'Freddie Freeman',pos:'1B',bats:'L',avg:'.325',hr:21},{name:'Will Smith',pos:'C',bats:'R',avg:'.261',hr:16},
      {name:'Max Muncy',pos:'3B',bats:'L',avg:'.196',hr:21},{name:'Cody Bellinger',pos:'CF',bats:'L',avg:'.210',hr:19},
      {name:'Gavin Lux',pos:'2B',bats:'L',avg:'.276',hr:6},{name:'Chris Taylor',pos:'LF',bats:'R',avg:'.221',hr:8},
      {name:'Justin Turner',pos:'DH',bats:'R',avg:'.278',hr:13},
    ],
    homeLineup:[
      {name:'Wilmer Flores',pos:'1B',bats:'R',avg:'.265',hr:14},{name:'Joc Pederson',pos:'DH',bats:'L',avg:'.274',hr:23},
      {name:'Brandon Belt',pos:'1B',bats:'L',avg:'.241',hr:17},{name:'Brandon Crawford',pos:'SS',bats:'L',avg:'.245',hr:9},
      {name:'Evan Longoria',pos:'3B',bats:'R',avg:'.220',hr:12},{name:'Austin Slater',pos:'RF',bats:'R',avg:'.257',hr:7},
      {name:'LaMonte Wade Jr.',pos:'LF',bats:'L',avg:'.234',hr:13},{name:'Joey Bart',pos:'C',bats:'R',avg:'.215',hr:8},
      {name:'Thairo Estrada',pos:'2B',bats:'R',avg:'.262',hr:10},
    ],
    awayBench:[{name:'Miguel Vargas',pos:'BN',bats:'R',avg:'.248',hr:4},{name:'Kevin Pillar',pos:'BN',bats:'R',avg:'.237',hr:6}],
    homeBench:[{name:'Jason Vosler',pos:'BN',bats:'L',avg:'.239',hr:5},{name:'Luis González',pos:'BN',bats:'L',avg:'.248',hr:2}],
  },
  { id:'g3', away:'ATL', home:'NYM', awayFull:'Atlanta Braves', homeFull:'New York Mets', time:'1:10 PM ET', status:'live',
    awaySP:{name:'Max Fried',pos:'SP',hand:'L',era:'2.48'},
    homeSP:{name:'Max Scherzer',pos:'SP',hand:'R',era:'2.29'},
    awayBullpen:{name:'ATL Bullpen',pos:'BULLPEN',pitchers:'Minter (C), Iglesias, Chavez'},
    homeBullpen:{name:'NYM Bullpen',pos:'BULLPEN',pitchers:'Díaz (C), Ottavino, May'},
    awayLineup:[
      {name:'Ronald Acuña Jr.',pos:'CF',bats:'R',avg:'.266',hr:15},{name:'Ozzie Albies',pos:'2B',bats:'S',avg:'.247',hr:17},
      {name:'Austin Riley',pos:'3B',bats:'R',avg:'.273',hr:38},{name:'Matt Olson',pos:'1B',bats:'L',avg:'.240',hr:34},
      {name:'Marcell Ozuna',pos:'DH',bats:'R',avg:'.226',hr:23},{name:'Travis d\'Arnaud',pos:'C',bats:'R',avg:'.249',hr:18},
      {name:'Adam Duvall',pos:'LF',bats:'R',avg:'.229',hr:12},{name:'Eddie Rosario',pos:'RF',bats:'L',avg:'.245',hr:11},
      {name:'Dansby Swanson',pos:'SS',bats:'R',avg:'.277',hr:18},
    ],
    homeLineup:[
      {name:'Brandon Nimmo',pos:'CF',bats:'L',avg:'.274',hr:16},{name:'Starling Marte',pos:'RF',bats:'R',avg:'.292',hr:16},
      {name:'Pete Alonso',pos:'1B',bats:'R',avg:'.271',hr:40},{name:'Francisco Lindor',pos:'SS',bats:'S',avg:'.270',hr:26},
      {name:'Mark Canha',pos:'LF',bats:'R',avg:'.260',hr:13},{name:'Eduardo Escobar',pos:'3B',bats:'S',avg:'.240',hr:20},
      {name:'Jeff McNeil',pos:'2B',bats:'L',avg:'.326',hr:9},{name:'Tomás Nido',pos:'C',bats:'R',avg:'.239',hr:4},
      {name:'Dominic Smith',pos:'DH',bats:'L',avg:'.247',hr:7},
    ],
    awayBench:[{name:'Guillermo Heredia',pos:'BN',bats:'R',avg:'.241',hr:2},{name:'Orlando Arcia',pos:'BN',bats:'R',avg:'.258',hr:5}],
    homeBench:[{name:'J.D. Davis',pos:'BN',bats:'R',avg:'.252',hr:7},{name:'Patrick Mazeika',pos:'BN',bats:'L',avg:'.211',hr:1}],
  },
];
let GAMES = [...FALLBACK_GAMES];
function buildSeriesGames(awayTeam, homeTeam, startDateOffset=0){
  const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const now=new Date();
  return Array.from({length:3},(_,i)=>{
    const d=new Date(now); d.setDate(d.getDate()+startDateOffset+i);
    const day=days[d.getDay()];
    const dateStr=d.toLocaleDateString('en-US',{month:'short',day:'numeric'});
    return{
      gameId:`series_${awayTeam.abbr}_${homeTeam.abbr}_g${i+1}`,
      gameNum:i+1,
      date:dateStr,
      dayLabel:day,
      away:awayTeam.abbr, awayFull:awayTeam.full,
      home:homeTeam.abbr, homeFull:homeTeam.full,
      time:'7:05 PM ET',
      status:'scheduled',
      awaySP:awayTeam.pitchers[i]||awayTeam.pitchers[0],
      homeSP:homeTeam.pitchers[i]||homeTeam.pitchers[0],
      awayBullpen:{name:`${awayTeam.abbr} Bullpen`,pos:'BULLPEN',pitchers:awayTeam.bullpen},
      homeBullpen:{name:`${homeTeam.abbr} Bullpen`,pos:'BULLPEN',pitchers:homeTeam.bullpen},
      awayLineup:awayTeam.lineup,
      homeLineup:homeTeam.lineup,
      awayBench:awayTeam.bench,
      homeBench:homeTeam.bench,
    };
  });
}
const TEAMS={
  LAD:{abbr:'LAD',full:'Los Angeles Dodgers',
    pitchers:[{name:'Yoshinobu Yamamoto',pos:'SP',hand:'R',era:'3.00'},{name:'Tyler Glasnow',pos:'SP',hand:'R',era:'3.21'},{name:'Gavin Stone',pos:'SP',hand:'R',era:'3.74'}],
    bullpen:'Evan Phillips (C), Ryan Brasier, Alex Vesia',
    lineup:[{name:'Mookie Betts',pos:'RF',bats:'R',avg:'.295',hr:19},{name:'Freddie Freeman',pos:'1B',bats:'L',avg:'.282',hr:16},{name:'Teoscar Hernández',pos:'LF',bats:'R',avg:'.272',hr:21},{name:'Will Smith',pos:'C',bats:'R',avg:'.258',hr:14},{name:'Max Muncy',pos:'3B',bats:'L',avg:'.211',hr:17},{name:'Tommy Edman',pos:'2B',bats:'S',avg:'.245',hr:5},{name:'Andy Pages',pos:'CF',bats:'R',avg:'.234',hr:12},{name:'Miguel Rojas',pos:'SS',bats:'R',avg:'.240',hr:4},{name:'Shohei Ohtani',pos:'DH',bats:'L',avg:'.310',hr:44}],
    bench:[{name:'James Outman',pos:'BN',bats:'L',avg:'.230',hr:7},{name:'Austin Barnes',pos:'BN',bats:'R',avg:'.218',hr:2}],
  },
  SD:{abbr:'SD',full:'San Diego Padres',
    pitchers:[{name:'Dylan Cease',pos:'SP',hand:'R',era:'3.47'},{name:'Michael King',pos:'SP',hand:'R',era:'2.95'},{name:'Joe Musgrove',pos:'SP',hand:'R',era:'4.10'}],
    bullpen:'Robert Suárez (C), Jeremiah Estrada, Tanner Scott',
    lineup:[{name:'Xander Bogaerts',pos:'SS',bats:'R',avg:'.256',hr:8},{name:'Jake Cronenworth',pos:'2B',bats:'L',avg:'.231',hr:10},{name:'Manny Machado',pos:'3B',bats:'R',avg:'.271',hr:21},{name:'Fernando Tatis Jr.',pos:'RF',bats:'R',avg:'.281',hr:28},{name:'Jurickson Profar',pos:'LF',bats:'S',avg:'.262',hr:11},{name:'Jackson Merrill',pos:'CF',bats:'L',avg:'.272',hr:16},{name:'Luis Arraez',pos:'1B',bats:'L',avg:'.314',hr:3},{name:'Kyle Higashioka',pos:'C',bats:'R',avg:'.236',hr:7},{name:'Donovan Solano',pos:'DH',bats:'R',avg:'.248',hr:5}],
    bench:[{name:'Tyler Wade',pos:'BN',bats:'S',avg:'.231',hr:1},{name:'David Peralta',pos:'BN',bats:'L',avg:'.245',hr:4}],
  },
  NYY:{abbr:'NYY',full:'New York Yankees',
    pitchers:[{name:'Gerrit Cole',pos:'SP',hand:'R',era:'2.63'},{name:'Carlos Rodón',pos:'SP',hand:'L',era:'4.02'},{name:'Clarke Schmidt',pos:'SP',hand:'R',era:'3.95'}],
    bullpen:'Clay Holmes (C), Tommy Kahnle, Luke Weaver',
    lineup:[{name:'Aaron Judge',pos:'CF',bats:'R',avg:'.322',hr:41},{name:'Juan Soto',pos:'RF',bats:'L',avg:'.288',hr:22},{name:'Giancarlo Stanton',pos:'DH',bats:'R',avg:'.248',hr:20},{name:'Anthony Rizzo',pos:'1B',bats:'L',avg:'.248',hr:12},{name:'Gleyber Torres',pos:'2B',bats:'R',avg:'.257',hr:11},{name:'Jazz Chisholm Jr.',pos:'3B',bats:'L',avg:'.272',hr:19},{name:'Anthony Volpe',pos:'SS',bats:'R',avg:'.246',hr:14},{name:'Austin Wells',pos:'C',bats:'L',avg:'.241',hr:13},{name:'Alex Verdugo',pos:'LF',bats:'L',avg:'.233',hr:9}],
    bench:[{name:'Oswaldo Cabrera',pos:'BN',bats:'S',avg:'.228',hr:5},{name:'Ben Rice',pos:'BN',bats:'L',avg:'.212',hr:6}],
  },
  BOS:{abbr:'BOS',full:'Boston Red Sox',
    pitchers:[{name:'Brayan Bello',pos:'SP',hand:'R',era:'3.90'},{name:'Tanner Houck',pos:'SP',hand:'R',era:'3.54'},{name:'Kutter Crawford',pos:'SP',hand:'R',era:'3.83'}],
    bullpen:'Kenley Jansen (C), Chris Martin, Brennan Bernardino',
    lineup:[{name:'Jarren Duran',pos:'CF',bats:'L',avg:'.285',hr:16},{name:'Rafael Devers',pos:'3B',bats:'L',avg:'.274',hr:26},{name:'Masataka Yoshida',pos:'DH',bats:'L',avg:'.261',hr:10},{name:'Triston Casas',pos:'1B',bats:'L',avg:'.238',hr:15},{name:'Tyler O\'Neill',pos:'LF',bats:'R',avg:'.256',hr:20},{name:'Wilyer Abreu',pos:'RF',bats:'R',avg:'.241',hr:11},{name:'David Hamilton',pos:'SS',bats:'L',avg:'.218',hr:5},{name:'Connor Wong',pos:'C',bats:'R',avg:'.230',hr:8},{name:'Vaughn Grissom',pos:'2B',bats:'R',avg:'.224',hr:7}],
    bench:[{name:'Rob Refsnyder',pos:'BN',bats:'R',avg:'.266',hr:4},{name:'Dominic Smith',pos:'BN',bats:'L',avg:'.241',hr:3}],
  },
  ATL:{abbr:'ATL',full:'Atlanta Braves',
    pitchers:[{name:'Chris Sale',pos:'SP',hand:'L',era:'2.41'},{name:'Spencer Strider',pos:'SP',hand:'R',era:'3.12'},{name:'Reynaldo López',pos:'SP',hand:'R',era:'3.06'}],
    bullpen:'Raisel Iglesias (C), Pierce Johnson, Joe Jiménez',
    lineup:[{name:'Ronald Acuña Jr.',pos:'CF',bats:'R',avg:'.303',hr:14},{name:'Ozzie Albies',pos:'2B',bats:'S',avg:'.266',hr:18},{name:'Austin Riley',pos:'3B',bats:'R',avg:'.257',hr:28},{name:'Matt Olson',pos:'1B',bats:'L',avg:'.243',hr:32},{name:'Marcell Ozuna',pos:'DH',bats:'R',avg:'.269',hr:29},{name:'Michael Harris II',pos:'RF',bats:'L',avg:'.261',hr:15},{name:'Jarred Kelenic',pos:'LF',bats:'L',avg:'.255',hr:12},{name:'Sean Murphy',pos:'C',bats:'R',avg:'.249',hr:17},{name:'Orlando Arcia',pos:'SS',bats:'R',avg:'.236',hr:6}],
    bench:[{name:'Travis d\'Arnaud',pos:'BN',bats:'R',avg:'.247',hr:7},{name:'Eli White',pos:'BN',bats:'R',avg:'.228',hr:3}],
  },
};
const DUMMY_SERIES=[
  {id:'ds_lad_sd',label:'LAD vs SD',awayFull:'Los Angeles Dodgers',homeFull:'San Diego Padres',away:'LAD',home:'SD',games:buildSeriesGames(TEAMS.LAD,TEAMS.SD,0)},
  {id:'ds_nyy_bos',label:'NYY vs BOS',awayFull:'New York Yankees',homeFull:'Boston Red Sox',away:'NYY',home:'BOS',games:buildSeriesGames(TEAMS.NYY,TEAMS.BOS,1)},
  {id:'ds_atl_lad',label:'ATL vs LAD',awayFull:'Atlanta Braves',homeFull:'Los Angeles Dodgers',away:'ATL',home:'LAD',games:buildSeriesGames(TEAMS.ATL,TEAMS.LAD,2)},
];
const POS_MAP = {
  '1':'SP','2':'C','3':'1B','4':'2B','5':'3B','6':'SS','7':'LF','8':'CF','9':'RF','10':'DH',
  'P':'SP','C':'C','1B':'1B','2B':'2B','3B':'3B','SS':'SS','LF':'LF','CF':'CF','RF':'RF','DH':'DH','OF':'CF',
};
async function fetchMLBGames(){
  try{
    const today=new Date().toLocaleDateString('en-CA');
    const schedUrl=`https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${today}&hydrate=team,linescore,probablePitcher(note),lineups`;
    const schedRes=await fetch(schedUrl);
    if(!schedRes.ok)return null;
    const schedData=await schedRes.json();
    const gameDates=schedData.dates||[];
    if(!gameDates.length)return null;
    const mlbGames=gameDates[0].games||[];
    if(!mlbGames.length)return null;
    const mapped=await Promise.all(mlbGames.slice(0,5).map(async(g,gi)=>{
      const awayTeam=g.teams.away.team;
      const homeTeam=g.teams.home.team;
      const awayAbbr=awayTeam.abbreviation||awayTeam.teamName?.slice(0,3).toUpperCase()||'AWY';
      const homeAbbr=homeTeam.abbreviation||homeTeam.teamName?.slice(0,3).toUpperCase()||'HME';
      const gameTime=g.gameDate?new Date(g.gameDate).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit',timeZoneName:'short'}):'TBD';
      const status=g.status?.abstractGameState==='Live'?'live':g.status?.abstractGameState==='Final'?'final':'scheduled';
      const awayPitcher=g.teams.away.probablePitcher;
      const homePitcher=g.teams.home.probablePitcher;
      const awaySP=awayPitcher?{name:awayPitcher.fullName,pos:'SP',hand:awayPitcher.pitchHand?.code||'R',era:awayPitcher.note||'---',mlbId:awayPitcher.id}:{name:'TBD',pos:'SP',hand:'R',era:'---'};
      const homeSP=homePitcher?{name:homePitcher.fullName,pos:'SP',hand:homePitcher.pitchHand?.code||'R',era:homePitcher.note||'---',mlbId:homePitcher.id}:{name:'TBD',pos:'SP',hand:'R',era:'---'};
      let awayLineup=[], homeLineup=[], awayBench=[], homeBench=[];
      try{
        const feedUrl=`https://statsapi.mlb.com/api/v1.1/game/${g.gamePk}/feed/live?fields=liveData,boxscore,teams,players,battingOrder,bench,person,fullName,primaryPosition,code,batSide,seasonStats,batting,avg,homeRuns`;
        const feedRes=await fetch(feedUrl);
        if(feedRes.ok){
          const feed=await feedRes.json();
          const boxTeams=feed?.liveData?.boxscore?.teams||{};
          const buildRoster=(teamData,isLineup)=>{
            const playerIds=isLineup?(teamData.battingOrder||[]):(teamData.bench||[]);
            return playerIds.slice(0,isLineup?9:2).map(id=>{
              const pl=teamData.players?.[`ID${id}`];
              if(!pl)return null;
              const pos=POS_MAP[pl.position?.code||pl.primaryPosition?.code]||pl.position?.abbreviation||'UT';
              const stats=pl.seasonStats?.batting||{};
              const avg=stats.avg||'.000';
              const hr=stats.homeRuns||0;
              const batSide=pl.batSide?.code||pl.person?.batSide?.code||'R';
              return{name:pl.person?.fullName||'Unknown',pos:isLineup?pos:'BN',bats:batSide,avg:String(avg).startsWith('.')?avg:'.'+avg,hr:Number(hr),mlbId:id};
            }).filter(Boolean);
          };
          awayLineup=buildRoster(boxTeams.away||{},true);
          homeLineup=buildRoster(boxTeams.home||{},true);
          awayBench=buildRoster(boxTeams.away||{},false);
          homeBench=buildRoster(boxTeams.home||{},false);
        }
      }catch{}
      const fallback=FALLBACK_GAMES[gi%FALLBACK_GAMES.length];
      if(awayLineup.length<9)awayLineup=fallback.awayLineup;
      if(homeLineup.length<9)homeLineup=fallback.homeLineup;
      if(awayBench.length<2)awayBench=fallback.awayBench;
      if(homeBench.length<2)homeBench=fallback.homeBench;
      return{
        id:`mlb_${g.gamePk}`,
        away:awayAbbr, home:homeAbbr,
        awayFull:awayTeam.name||awayTeam.teamName, homeFull:homeTeam.name||homeTeam.teamName,
        time:gameTime, status,
        awaySP, homeSP,
        awayBullpen:{name:`${awayAbbr} Bullpen`,pos:'BULLPEN',pitchers:'Bullpen TBD'},
        homeBullpen:{name:`${homeAbbr} Bullpen`,pos:'BULLPEN',pitchers:'Bullpen TBD'},
        awayLineup, homeLineup, awayBench, homeBench,
      };
    }));
    return mapped.filter(Boolean);
  }catch(err){
    console.warn('MLB API fetch failed:',err);
    return null;
  }
}
function genStats(p) {
  const r=()=>Math.random();
  if(p.pos==='SP'){
    const ip=(4+r()*3).toFixed(1); const k=Math.floor(r()*10); const er=Math.floor(r()*5);
    const bb=Math.floor(r()*3); const w=r()>.5?1:0;
    const ipF=parseFloat(ip);
    const qs=ipF>=6&&er<=3?1:0; const cg=ipF>=9?1:0; const cgso=cg&&er===0?1:0;
    const nh=cgso&&r()>.9?1:0; const hbp_pit=r()<.15?Math.floor(r()*2)+1:0;
    return {ip,k,er,bb,w,sv:0,qs,cg,cgso,nh,hbp_pit};
  }
  if(p.pos==='BULLPEN'){
    const ip=(1+r()*2).toFixed(1); const k=Math.floor(r()*5); const er=Math.floor(r()*3);
    const bb=Math.floor(r()*2); const sv=r()>.5?1:0; const hbp_pit=r()<.1?1:0;
    return {ip,k,er,bb,w:0,sv,qs:0,cg:0,cgso:0,nh:0,hbp_pit};
  }
  const hr=r()<.08?1:0; const triple=!hr&&r()<.04?1:0; const double=!hr&&!triple&&r()<.12?1:0;
  const single=!hr&&!triple&&!double&&r()<.28?Math.floor(r()*2)+1:0;
  const rbi=Math.floor(r()*(hr?4:2)); const run=Math.floor(r()*2);
  const bb=r()<.1?1:0; const sb=r()<.06?1:0; const k=!single&&!double&&!triple&&!hr&&r()<.25?1:0;
  const cs_bat=sb&&r()<.25?1:0; const hbp_bat=r()<.05?1:0; const gidp=r()<.08?1:0;
  const putout=Math.floor(r()*3); const assist=Math.floor(r()*2);
  const caught_stealing=r()<.08?1:0; const double_play=r()<.12?1:0; const error=r()<.06?1:0;
  return {hr,triple,double,single,rbi,run,bb,sb,k,cs_bat,hbp_bat,gidp,putout,assist,caught_stealing,double_play,error};
}
function calcFpts(p, sc) {
  let pts=0;
  const s=p.stats;
  if(p.pos==='SP'||p.pos==='BULLPEN'){
    pts+=parseFloat(s.ip)*sc.ip + s.k*sc.k_pit + s.er*sc.er + s.bb*sc.bb_pit
      + (s.w||0)*sc.win + (s.sv||0)*sc.save
      + (s.qs||0)*sc.qs + (s.cg||0)*sc.cg + (s.cgso||0)*sc.cgso
      + (s.nh||0)*sc.nh + (s.hbp_pit||0)*sc.hbp_pit;
  } else {
    pts+=s.hr*sc.hr + s.triple*sc.triple + s.double*sc.double + s.single*sc.single
      + s.rbi*sc.rbi + s.run*sc.run + s.bb*sc.bb_bat + s.sb*sc.sb + s.k*sc.k_bat
      + (s.cs_bat||0)*sc.cs_bat + (s.hbp_bat||0)*sc.hbp_bat + (s.gidp||0)*sc.gidp;
    if(sc.def_enabled){
      pts+=(s.putout||0)*sc.putout + (s.assist||0)*sc.assist
        + (s.caught_stealing||0)*sc.caught_stealing + (s.double_play||0)*sc.double_play
        + (s.error||0)*sc.error;
    }
  }
  return Math.round(pts*10)/10;
}
function hasLineups(g){ return g&&g.awayLineup&&g.awayLineup.length>=9&&g.awayLineup[0]?.name!=='TBD'; }
async function fetchLineupsForGame(gamePk){
  try{
    const feedUrl=`https://statsapi.mlb.com/api/v1.1/game/${gamePk}/feed/live?fields=liveData,boxscore,teams,players,battingOrder,bench,person,fullName,primaryPosition,code,batSide,seasonStats,batting,avg,homeRuns`;
    const res=await fetch(feedUrl); if(!res.ok)return null;
    const feed=await res.json();
    const boxTeams=feed?.liveData?.boxscore?.teams||{};
    const buildRoster=(teamData,isLineup)=>{
      const ids=isLineup?(teamData.battingOrder||[]):(teamData.bench||[]);
      return ids.slice(0,isLineup?9:2).map(id=>{
        const pl=teamData.players?.[`ID${id}`]; if(!pl)return null;
        const pos=POS_MAP[pl.position?.code||pl.primaryPosition?.code]||pl.position?.abbreviation||'UT';
        const stats=pl.seasonStats?.batting||{};
        const avg=stats.avg||'.000'; const hr=stats.homeRuns||0;
        const batSide=pl.batSide?.code||pl.person?.batSide?.code||'R';
        return{name:pl.person?.fullName||'Unknown',pos:isLineup?pos:'BN',bats:batSide,avg:String(avg).startsWith('.')?avg:'.'+avg,hr:Number(hr)};
      }).filter(Boolean);
    };
    const awayLineup=buildRoster(boxTeams.away||{},true);
    const homeLineup=buildRoster(boxTeams.home||{},true);
    const awayBench=buildRoster(boxTeams.away||{},false);
    const homeBench=buildRoster(boxTeams.home||{},false);
    if(awayLineup.length<9||homeLineup.length<9)return null;
    return{awayLineup,homeLineup,awayBench,homeBench};
  }catch{return null;}
}
function snakeChooser(i, fp, op) {
  const round=Math.floor(i/2); const roundFp=round%2===0; const firstInPair=i%2===0;
  return roundFp?(firstInPair?fp:op):(firstInPair?op:fp);
}
function buildOrderPosition(fp, slots) {
  const op=fp==='challenger'?'opponent':'challenger';
  return slots.map((_,i)=>({chooser:i%2===0?fp:op}));
}
function buildOrderNoLimits(fp, slots) {
  let total=0; slots.forEach(sl=>{if(sl.away)total++;if(sl.home)total++;});
  const op=fp==='challenger'?'opponent':'challenger';
  return Array.from({length:total},(_,i)=>({chooser:snakeChooser(i,fp,op)}));
}
function buildOrder(fp, slots, mode='position') {
  return mode==='free'?buildOrderNoLimits(fp,slots):buildOrderPosition(fp,slots);
}
function buildSlotsForRound(game, round) {
  const slots=[];
  if(round===1){
    slots.push({phase:'sp',posLabel:'SP',away:game.awaySP,home:game.homeSP});
    slots.push({phase:'bullpen',posLabel:'BP',away:game.awayBullpen,home:game.homeBullpen});
  } else {
    const POS_ORDER=['C','1B','2B','3B','SS','LF','CF','RF','DH'];
    const sortLineup=(lineup)=>[...lineup].sort((a,b)=>{
      const ai=POS_ORDER.indexOf(a.pos); const bi=POS_ORDER.indexOf(b.pos);
      return (ai===-1?99:ai)-(bi===-1?99:bi);
    });
    const awayLU=sortLineup(game.awayLineup);
    const homeLU=sortLineup(game.homeLineup);
    const len=Math.max(awayLU.length,homeLU.length);
    for(let i=0;i<len;i++){
      const ap=awayLU[i]||null, hp=homeLU[i]||null;
      const pos=ap?.pos||hp?.pos||'OF';
      slots.push({phase:'lineup',posLabel:pos,away:ap,home:hp});
    }
    const maxB=Math.max(game.awayBench.length,game.homeBench.length);
    for(let i=0;i<maxB;i++) slots.push({phase:'bench',posLabel:'BN',away:game.awayBench[i]||null,home:game.homeBench[i]||null});
  }
  return slots;
}
function buildSlots(game){return[...buildSlotsForRound(game,1),...buildSlotsForRound(game,2)];}
const STAT_FILTERS=[
  {id:'vs_sp',   label:'vs SP',    desc:'Career vs opp SP'},
  {id:'vs_lu',   label:'vs Lineup',desc:'Career vs opp lineup'},
  {id:'last1',   label:'Last Game',desc:'Last game stats'},
  {id:'last7',   label:'L7',       desc:'Last 7 games'},
  {id:'last30',  label:'L30',      desc:'Last 30 days'},
  {id:'last60',  label:'L60',      desc:'Last 60 days'},
  {id:'season',  label:'Season',   desc:'This season'},
  {id:'prev',    label:'Prev Szn', desc:'Previous season'},
];
function slotMetaTxt(p, game, side, filter='season'){
  if(!p)return'';
  if(p.pos==='SP'){
    const base=`${p.hand}HP · ERA ${p.era}`;
    if(filter==='vs_lu') return `${base} · vs ${side==='away'?(game?.home||'opp'):(game?.away||'opp')} lineup`;
    if(filter==='last1') return `${base} · last start`;
    if(filter==='last7') return `${base} · last 7d`;
    if(filter==='last30') return `${base} · last 30d`;
    return base;
  }
  if(p.pos==='BULLPEN') return p.pitchers||'';
  const base=`${p.bats}HB · ${p.avg} AVG · ${p.hr}HR`;
  if(filter==='vs_sp') return `${base} · vs ${side==='away'?(game?.homeSP?.name||'SP'):(game?.awaySP?.name||'SP')}`;
  if(filter==='last1') return `${base} · last game`;
  if(filter==='last7') return `${base} · L7`;
  if(filter==='last30') return `${base} · L30`;
  if(filter==='last60') return `${base} · L60`;
  if(filter==='prev') return `${base} · prev szn`;
  return base;
}
function buildSimEvents(picks,sc){
  const events=[];
  ['challenger','opponent'].forEach(role=>{
    const sp=picks[role].find(x=>x.pos==='SP');
    const bp=picks[role].find(x=>x.pos==='BULLPEN');
    const batters=picks[role].filter(x=>x.pos!=='SP'&&x.pos!=='BULLPEN');
    if(sp){
      const ipF=parseFloat(sp.stats.ip); const spInns=Math.max(1,Math.min(6,Math.floor(ipF)));
      for(let inn=1;inn<=spInns;inn++){
        const pts=Math.round(((ipF/spInns)*sc.ip+(sp.stats.k/spInns)*sc.k_pit+(sp.stats.er/spInns)*sc.er+(sp.stats.bb/spInns)*sc.bb_pit)*10)/10;
        events.push({inn,role,pts,desc:`${sp.name} works the ${inn===1?'1st':inn===2?'2nd':inn===3?'3rd':inn+'th'} (${Math.round(sp.stats.k/spInns)}K)`});
      }
      if(sp.stats.w) events.push({inn:Math.min(7,Math.floor(parseFloat(sp.stats.ip))),role,pts:sc.win,desc:`${sp.name} earns the WIN ✅`});
    }
    if(bp){
      const ipF=parseFloat(bp.stats.ip); const bpInns=Math.max(1,Math.min(3,Math.ceil(ipF)));
      for(let i=0;i<bpInns;i++){
        const inn=7+i;
        const pts=Math.round(((ipF/bpInns)*sc.ip+(bp.stats.k/bpInns)*sc.k_pit+(bp.stats.er/bpInns)*sc.er+(bp.stats.bb/bpInns)*sc.bb_pit)*10)/10;
        events.push({inn,role,pts,desc:bp.stats.sv&&i===bpInns-1?'Bullpen slams the door — SAVE 🔒':`Bullpen holds in the ${inn===7?'7th':inn===8?'8th':'9th'}`});
      }
      if(bp.stats.sv) events.push({inn:9,role,pts:sc.save,desc:`${bp.name} — SAVE recorded`});
    }
    batters.forEach((bat,bi)=>{
      const inn=1+(bi%9); const s=bat.stats;
      const hitStr=s.hr?'LAUNCHES a homer 💥':s.triple?'triples!':s.double?'doubles':s.single?`singles (${s.single}H)`:'goes hitless';
      events.push({inn,role,pts:bat.fpts,desc:`${bat.name} ${hitStr}${s.rbi>0?` — ${s.rbi} RBI`:''}${s.sb?' + SB':''}`});
    });
  });
  return events.filter(e=>e.pts!==0||e.desc.includes('WIN')||e.desc.includes('SAVE')).sort((a,b)=>a.inn-b.inn||Math.abs(b.pts)-Math.abs(a.pts));
}
function generateQuip(winnerName,loserName,wPts,lPts,wPicks,lPicks){
  const margin=Math.round((wPts-lPts)*10)/10;
  const mvp=(wPicks||[]).reduce((a,b)=>((b.fpts||0)>(a.fpts||0)?b:a),{name:'someone',fpts:0});
  const blowout=margin>35, close=margin<6;
  const pool=blowout?[
    `${winnerName} didn't just win — they sent a message. ${mvp.name} was unstoppable.`,
    `This one got out of hand early. ${winnerName} wins going away.`,
    `${loserName} is going to need a long offseason to recover from this one.`,
  ]:close?[
    `${winnerName} escapes with a nail-biter. ${loserName} will be thinking about this all week.`,
    `${margin} points. That's it. ${loserName} — you were THIS close.`,
    `Uglier than a check-swing single, but ${winnerName} takes the W.`,
  ]:[
    `${winnerName} puts together a complete lineup and it shows. ${mvp.name} leads the way.`,
    `Solid all-around game from ${winnerName}. ${loserName} needs a better draft strategy.`,
    `${winnerName} by ${margin}. ${loserName} thought they had a shot. They did not.`,
  ];
  return pool[Math.floor(Math.random()*pool.length)];
}
const S = {
  page:{minHeight:'100vh',background:'#0d1117',color:'#e8edf2',fontFamily:"'DM Sans',system-ui,sans-serif"},
  wrap:{maxWidth:430,margin:'0 auto',padding:'12px 16px 32px'},
  header:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12,paddingTop:8},
  card:{background:'#141b22',border:'1px solid #2a3540',borderRadius:10,padding:'14px',marginBottom:12},
  cardTitle:{fontFamily:"'Bebas Neue',Arial,serif",fontSize:15,letterSpacing:1.5,color:'#f5c842',marginBottom:10,display:'flex',alignItems:'center',gap:6},
  display:{fontFamily:"'Bebas Neue',Arial,serif"},
  btnGold:{background:'#f5c842',color:'#0d1117',border:'none',borderRadius:7,padding:'10px 16px',fontFamily:"'Bebas Neue',Arial,serif",fontSize:15,letterSpacing:1.5,cursor:'pointer',fontWeight:700},
  btnOutline:{background:'none',border:'1px solid #2a3540',color:'#e8edf2',borderRadius:7,padding:'9px 14px',fontFamily:'monospace',fontSize:12,letterSpacing:1,cursor:'pointer'},
  actionCard:{background:'#141b22',border:'1px solid #2a3540',borderRadius:10,padding:'14px',cursor:'pointer',textAlign:'center',width:'100%'},
  input:{background:'#1c2630',border:'1px solid #2a3540',borderRadius:6,padding:'10px 12px',color:'#e8edf2',fontSize:14,width:'100%',boxSizing:'border-box',outline:'none'},
  gameRow:{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 12px',borderRadius:8,marginBottom:8,cursor:'pointer',border:'2px solid #2a3540',background:'#1c2630'},
  label:{fontFamily:'monospace',fontSize:11,color:'#6b7a8d',letterSpacing:1,textTransform:'uppercase',marginBottom:6},
  empty:{textAlign:'center',color:'#6b7a8d',padding:'20px 0',fontSize:13},
  badge:{background:'#e84545',color:'#fff',borderRadius:'50%',width:18,height:18,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'monospace',fontSize:10,fontWeight:700},
  fpBadge:{fontFamily:'monospace',fontSize:9,color:'#f5c842',letterSpacing:1,textTransform:'uppercase',display:'flex',alignItems:'center',gap:3,marginTop:2},
  friendRow:{display:'flex',alignItems:'center',padding:'8px 0',borderBottom:'1px solid rgba(42,53,64,.5)'},
  row:{display:'flex',alignItems:'center',padding:'8px 0'},
  backBtn:{background:'none',border:'none',color:'#6b7a8d',fontSize:13,cursor:'pointer',padding:0,fontFamily:'monospace'},
};
function LoadingScreen({gamesLoading}){
  return(
    <div style={{...S.page,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:12}}>
      <div style={{fontSize:48}}>⚾</div>
      <div style={{...S.display,fontSize:28,color:'#f5c842',letterSpacing:3}}>DIAMOND DUEL</div>
      <div style={{fontFamily:'monospace',fontSize:12,color:'#6b7a8d'}}>{gamesLoading?'Fetching today\'s games…':'Loading…'}</div>
      {gamesLoading&&<div style={{width:120,height:2,background:'#1c2630',borderRadius:1,marginTop:4,overflow:'hidden'}}><div style={{height:'100%',background:'#f5c842',borderRadius:1,animation:'pulse 1.2s ease-in-out infinite',width:'40%'}}/></div>}
    </div>
  );
}
const notify=(title,body,opts={})=>{
  try{
    if(Notification.permission==='granted'){
      new Notification(title,{body,icon:'https://img.icons8.com/emoji/48/baseball.png',...opts});
    }
  }catch{}
};
const requestNotifPermission=async()=>{
  try{
    if('Notification' in window && Notification.permission==='default'){
      return await Notification.requestPermission();
    }
    return Notification.permission;
  }catch{return 'denied';}
};
function OnboardScreen({onComplete}){
  const [step,setStep]=useState(0);
  const [name,setName]=useState('');
  const [teamName,setTeamName]=useState('');
  const [contactType,setContactType]=useState('email');
  const [contact,setContact]=useState('');
  const [avatar,setAvatar]=useState('⚾');
  const [color,setColor]=useState('#4a9eff');
  const [notifStatus,setNotifStatus]=useState('default');
  const contactValid=()=>{
    if(!contact.trim())return true;
    if(contactType==='email')return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.trim());
    return /^\+?[\d\s\-()]{7,}$/.test(contact.trim());
  };
  const requestNotifs=async()=>{
    const result=await requestNotifPermission();
    setNotifStatus(result);
    if(result==='granted') notify('⚾ Diamond Duel','You\'re all set! We\'ll notify you when it\'s draft time.');
  };
  const finish=()=>{
    const profile={
      id:'u_'+Math.random().toString(36).slice(2,10),
      name:name.trim(),
      teamName:(teamName.trim()||name.trim()+' FC'),
      contact:contact.trim()||null,
      contactType,
      avatar,color,
      joinCode:Math.random().toString(36).slice(2,7).toUpperCase(),
      wins:0,losses:0,ties:0,totalPts:0,games:0,
      notifs:notifStatus==='granted',
    };
    onComplete(profile);
  };
  const stepLabels=['Profile','Look','Alerts'];
  return(
    <div style={S.page}><div style={{maxWidth:400,margin:'0 auto',padding:'12px 16px'}}>
      {}
      <div style={{textAlign:'center',marginBottom:24,paddingTop:20}}>
        <div style={{fontSize:52,marginBottom:6}}>⚾</div>
        <div style={{...S.display,fontSize:38,color:'#f5c842',letterSpacing:3}}>DIAMOND DUEL</div>
        <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',letterSpacing:2,marginTop:3}}>SINGLE GAME FANTASY BASEBALL</div>
      </div>
      {}
      <div style={{display:'flex',gap:6,marginBottom:20,justifyContent:'center'}}>
        {stepLabels.map((l,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:4}}>
            <div style={{width:24,height:24,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,fontFamily:'monospace',
              background:i<step?'#3dd68c':i===step?'#f5c842':'#2a3540',
              color:i<=step?'#0d1117':'#6b7a8d'}}>{i<step?'✓':i+1}</div>
            <div style={{fontFamily:'monospace',fontSize:9,color:i===step?'#f5c842':'#6b7a8d',letterSpacing:.5}}>{l}</div>
            {i<2&&<div style={{width:16,height:1,background:i<step?'#3dd68c':'#2a3540'}}/>}
          </div>
        ))}
      </div>
      {}
      {step===0&&(<div style={S.card}>
        <div style={S.cardTitle}>👤 Create Your Profile</div>
        <div style={S.label}>Your Name</div>
        <input style={{...S.input,marginBottom:12}} value={name} onChange={e=>setName(e.target.value)} placeholder="First name or nickname…" maxLength={20} autoFocus onKeyDown={e=>e.key==='Enter'&&name.trim()&&document.getElementById('teamInput')?.focus()}/>
        <div style={S.label}>Team Name</div>
        <input id="teamInput" style={{...S.input,marginBottom:16}} value={teamName} onChange={e=>setTeamName(e.target.value)} placeholder={name.trim()?`${name.trim()}'s Squad`:'Your Squad…'} maxLength={24} onKeyDown={e=>e.key==='Enter'&&name.trim()&&document.getElementById('contactInput')?.focus()}/>
        {}
        <div style={S.label}>Email or Phone <span style={{color:'#3a4a5a',fontWeight:400}}>· optional</span></div>
        <div style={{display:'flex',marginBottom:8}}>
          {[['email','✉️ Email'],['phone','📱 Phone']].map(([v,label])=>(
            <button key={v} onClick={()=>{setContactType(v);setContact('');}} style={{flex:1,padding:'7px 0',background:contactType===v?'rgba(245,200,66,.1)':'#1c2630',border:`1px solid ${contactType===v?'rgba(245,200,66,.3)':'#2a3540'}`,borderRight:v==='email'?'none':'auto',borderRadius:v==='email'?'6px 0 0 6px':'0 6px 6px 0',color:contactType===v?'#f5c842':'#6b7a8d',fontFamily:'monospace',fontSize:11,cursor:'pointer'}}>{label}</button>
          ))}
        </div>
        <input
          id="contactInput"
          style={{...S.input,marginBottom:4,borderColor:contact&&!contactValid()?'rgba(232,69,69,.5)':'undefined'}}
          value={contact}
          onChange={e=>setContact(e.target.value)}
          placeholder={contactType==='email'?'you@example.com':'(555) 555-5555'}
          type={contactType==='email'?'email':'tel'}
          inputMode={contactType==='email'?'email':'tel'}
          onKeyDown={e=>e.key==='Enter'&&name.trim()&&contactValid()&&setStep(1)}
        />
        {contact&&!contactValid()&&<div style={{fontFamily:'monospace',fontSize:10,color:'#e84545',marginBottom:8}}>Enter a valid {contactType}</div>}
        <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',marginTop:4,marginBottom:16,lineHeight:1.5}}>Used for account recovery and challenge notifications. Never shared.</div>
        <button style={{...S.btnGold,width:'100%'}} disabled={!name.trim()||(!!contact&&!contactValid())} onClick={()=>name.trim()&&contactValid()&&setStep(1)}>Next →</button>
      </div>)}
      {}
      {step===1&&(<div style={S.card}>
        <div style={S.cardTitle}>🎨 Pick Your Look</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:8,marginBottom:14}}>
          {AVATARS.map(a=>(<div key={a} onClick={()=>setAvatar(a)} style={{display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,padding:8,borderRadius:8,cursor:'pointer',border:`2px solid ${avatar===a?'#f5c842':'#2a3540'}`,background:avatar===a?'rgba(245,200,66,.1)':'#1c2630'}}>{a}</div>))}
        </div>
        <div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap'}}>
          {COLORS.map(c=>(<div key={c} onClick={()=>setColor(c)} style={{width:28,height:28,borderRadius:'50%',background:c,cursor:'pointer',border:`3px solid ${color===c?'#fff':'transparent'}`}}/>))}
        </div>
        <div style={{textAlign:'center',marginBottom:14}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:10,padding:'10px 16px',background:color+'22',border:`1px solid ${color}44`,borderRadius:10}}>
            <span style={{fontSize:32}}>{avatar}</span>
            <div style={{textAlign:'left'}}>
              <div style={{fontSize:14,fontWeight:700,color}}>{name||'Your Name'}</div>
              <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d'}}>{teamName||name+' Squad'}</div>
            </div>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          <button style={{...S.btnOutline}} onClick={()=>setStep(0)}>← Back</button>
          <button style={{...S.btnGold}} onClick={()=>setStep(2)}>Next →</button>
        </div>
      </div>)}
      {}
      {step===2&&(<div style={S.card}>
        <div style={S.cardTitle}>🔔 Stay in the Game</div>
        <div style={{fontSize:13,color:'#8a9bb0',lineHeight:1.6,marginBottom:16}}>
          Get notified when it matters — lineups drop, it's your pick, the lead changes, or the final score is in.
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:20}}>
          {[['📋','Draft time','When lineups are posted and it\'s time to draft'],
            ['⚡','Your turn','When it\'s your pick in the draft'],
            ['📊','Lead changes','When your opponent takes the lead during a sim'],
            ['🏆','Game results','Final scores and win/loss notifications'],
          ].map(([icon,title,desc])=>(
            <div key={title} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'8px 10px',background:'#1c2630',borderRadius:7,border:'1px solid #2a3540'}}>
              <span style={{fontSize:16,flexShrink:0,marginTop:1}}>{icon}</span>
              <div><div style={{fontSize:12,fontWeight:600,color:'#e8edf2'}}>{title}</div><div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',marginTop:1}}>{desc}</div></div>
            </div>
          ))}
        </div>
        {notifStatus==='granted'
          ?<div style={{padding:'10px',background:'rgba(61,214,140,.08)',border:'1px solid rgba(61,214,140,.2)',borderRadius:7,textAlign:'center',color:'#3dd68c',fontFamily:'monospace',fontSize:12,marginBottom:12}}>✓ Notifications enabled</div>
          :notifStatus==='denied'
            ?<div style={{padding:'10px',background:'rgba(232,69,69,.06)',border:'1px solid rgba(232,69,69,.2)',borderRadius:7,textAlign:'center',color:'#e84545',fontFamily:'monospace',fontSize:11,marginBottom:12}}>Blocked — enable in your browser settings</div>
            :<button style={{...S.btnGold,width:'100%',marginBottom:12}} onClick={requestNotifs}>🔔 Enable Notifications</button>
        }
        <button style={{...S.btnOutline,width:'100%',marginBottom:8}} onClick={finish}>
          {notifStatus==='granted'?'Let\'s Play! →':'Skip for now →'}
        </button>
        <button style={{background:'none',border:'none',color:'#6b7a8d',fontFamily:'monospace',fontSize:10,cursor:'pointer',width:'100%',textDecoration:'underline'}} onClick={()=>setStep(1)}>← Back</button>
      </div>)}
    </div></div>
  );
}
function DuelChat({duelId, me, opponentName, onClose}){
  const [msgs,setMsgs]=useState([]);
  const [text,setText]=useState('');
  const [loading,setLoading]=useState(true);
  const bottomRef=useRef(null);
  const pollRef=useRef(null);
  const loadMsgs=async()=>{
    const m=await sget(`chat:${duelId}`)||[];
    setMsgs(m); setLoading(false);
    setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:'smooth'}),50);
  };
  useEffect(()=>{
    loadMsgs();
    pollRef.current=setInterval(loadMsgs,3000);
    return()=>clearInterval(pollRef.current);
  },[duelId]);
  const send=async()=>{
    const t=text.trim(); if(!t)return;
    setText('');
    const m={id:Date.now(),senderId:me.id,senderName:me.name,senderAvatar:me.avatar,text:t,ts:Date.now()};
    const all=await sget(`chat:${duelId}`)||[];
    all.push(m);
    await sset(`chat:${duelId}`,all);
    setMsgs([...all]);
    setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:'smooth'}),50);
  };
  const TRASH=[
    '📉 Your lineup is a disaster waiting to happen',
    '😴 Wake me up when your team scores',
    '🗑️ Bold strategy picking that guy',
    '👀 You really picked that player lol',
    '💀 RIP your roster',
    '🔥 My squad is built different',
    '😬 Yikes',
    '📊 The analytics say you\'re cooked',
  ];
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.85)',zIndex:200,display:'flex',flexDirection:'column'}}>
      <div style={{background:'#141b22',borderBottom:'1px solid #2a3540',padding:'12px 16px',display:'flex',alignItems:'center',gap:10}}>
        <button onClick={onClose} style={{background:'none',border:'none',color:'#6b7a8d',fontSize:18,cursor:'pointer',padding:0,lineHeight:1}}>✕</button>
        <div style={{flex:1}}>
          <div style={{...S.display,fontSize:16,color:'#f5c842',letterSpacing:1}}>TRASH TALK</div>
          <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d'}}>vs {opponentName}</div>
        </div>
        <div style={{fontSize:22}}>🗣️</div>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'12px 16px',display:'flex',flexDirection:'column',gap:8}}>
        {loading&&<div style={{textAlign:'center',color:'#6b7a8d',fontFamily:'monospace',fontSize:12,marginTop:20}}>Loading…</div>}
        {!loading&&msgs.length===0&&(
          <div style={{textAlign:'center',padding:'30px 20px'}}>
            <div style={{fontSize:32,marginBottom:8}}>🤐</div>
            <div style={{fontFamily:'monospace',fontSize:12,color:'#6b7a8d'}}>No messages yet. Start the trash talk.</div>
          </div>
        )}
        {msgs.map(m=>{
          const isMe=m.senderId===me.id;
          return(
            <div key={m.id} style={{display:'flex',flexDirection:isMe?'row-reverse':'row',alignItems:'flex-end',gap:8}}>
              <div style={{fontSize:20,flexShrink:0}}>{m.senderAvatar||'⚾'}</div>
              <div style={{maxWidth:'72%'}}>
                <div style={{fontFamily:'monospace',fontSize:9,color:'#6b7a8d',marginBottom:3,textAlign:isMe?'right':'left'}}>{m.senderName}</div>
                <div style={{padding:'8px 12px',borderRadius:12,borderBottomRightRadius:isMe?2:12,borderBottomLeftRadius:isMe?12:2,background:isMe?'#4a9eff22':' #2a3540',border:`1px solid ${isMe?'#4a9eff44':'#3a4a5a'}`,fontSize:13,color:'#e8edf2',lineHeight:1.4}}>
                  {m.text}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef}/>
      </div>
      {}
      <div style={{padding:'8px 16px',overflowX:'auto',display:'flex',gap:6,borderTop:'1px solid #2a3540'}}>
        {TRASH.map((t,i)=>(
          <button key={i} onClick={async()=>{
            setText(t);
          }} style={{background:'#1c2630',border:'1px solid #2a3540',borderRadius:20,padding:'5px 10px',fontSize:11,color:'#8a9bb0',cursor:'pointer',whiteSpace:'nowrap',flexShrink:0}}>{t}</button>
        ))}
      </div>
      {}
      <div style={{padding:'10px 16px 24px',borderTop:'1px solid #2a3540',display:'flex',gap:8,background:'#0d1117'}}>
        <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Say something…" style={{...S.input,flex:1}}/>
        <button onClick={send} disabled={!text.trim()} style={{...S.btnGold,padding:'10px 16px',opacity:text.trim()?1:0.4}}>Send</button>
      </div>
    </div>
  );
}
function CoinFlip({title,subtitle,mode,callerName,winnerLabel,ctaLabel,onComplete}){
  const [stage,setStage]=useState(mode==='random'?'ready':'call');
  const [result,setResult]=useState(null);
  const [called,setCalled]=useState(null);
  const [callerWon,setCallerWon]=useState(null);
  const flip=(side)=>{
    setCalled(side); setStage('flipping');
    const res=Math.random()<.5?'heads':'tails';
    setTimeout(()=>{ setResult(res); setCallerWon(side===null?null:side===res); setStage('result'); },1450);
  };
  return(
    <div style={{background:'#141b22',border:'1px solid rgba(245,200,66,.25)',borderRadius:12,padding:'24px 20px',textAlign:'center'}}>
      <div style={{fontFamily:"'Bebas Neue',Arial,serif",fontSize:22,color:'#f5c842',letterSpacing:2,marginBottom:4}}>{title}</div>
      <div style={{fontSize:13,color:'#6b7a8d',marginBottom:22}}>{subtitle}</div>
      <div style={{perspective:'600px',margin:'0 auto 24px',width:100,height:100}}>
        <div style={{width:100,height:100,position:'relative',transformStyle:'preserve-3d',
          transform:stage==='flipping'?'rotateY(900deg)':result?`rotateY(${result==='heads'?1800:1980}deg)`:'rotateY(0)',
          transition:'transform 1.3s cubic-bezier(.4,0,.2,1)'}}>
          <div style={{position:'absolute',inset:0,borderRadius:'50%',backfaceVisibility:'hidden',background:'radial-gradient(circle at 35% 35%,#ffd95c,#b8840a)',border:'4px solid #f5c842',display:'flex',alignItems:'center',justifyContent:'center',fontSize:36,boxShadow:'0 0 18px rgba(245,200,66,.3)'}}>⚾</div>
          <div style={{position:'absolute',inset:0,borderRadius:'50%',backfaceVisibility:'hidden',background:'radial-gradient(circle at 35% 35%,#8a9bb0,#3a4a5a)',border:'4px solid #5a6a7a',display:'flex',alignItems:'center',justifyContent:'center',fontSize:36,transform:'rotateY(180deg)'}}>🏟️</div>
        </div>
      </div>
      {stage==='ready'&&(<div>
        <div style={{fontFamily:'monospace',fontSize:11,color:'#6b7a8d',marginBottom:14,letterSpacing:1,textTransform:'uppercase'}}>Tap to flip — winner picks first</div>
        <button onClick={()=>flip(null)} style={{background:'#f5c842',color:'#0d1117',border:'none',borderRadius:8,fontFamily:"'Bebas Neue',Arial,serif",fontSize:17,letterSpacing:2,cursor:'pointer',padding:'12px 0',width:'100%'}}>🪙 Flip the Coin</button>
      </div>)}
      {stage==='call'&&(<div>
        <div style={{fontFamily:'monospace',fontSize:11,color:'#6b7a8d',marginBottom:12,textTransform:'uppercase',letterSpacing:1}}>{callerName} calls it:</div>
        <div style={{display:'flex',gap:10,justifyContent:'center'}}>
          {[['heads','⚾ Heads'],['tails','🏟️ Tails']].map(([s,l])=>(
            <button key={s} onClick={()=>flip(s)} style={{flex:1,maxWidth:150,padding:'11px 8px',border:'2px solid #2a3540',background:'none',color:'#e8edf2',borderRadius:8,fontFamily:"'Bebas Neue',Arial,serif",fontSize:17,letterSpacing:2,cursor:'pointer'}}>{l}</button>
          ))}
        </div>
      </div>)}
      {stage==='flipping'&&(<div style={{fontFamily:'monospace',fontSize:12,color:'#6b7a8d',letterSpacing:1,minHeight:28}}>{mode==='call'?`${callerName} called ${called}… flipping`:'Flipping…'}</div>)}
      {stage==='result'&&(<div>
        <div style={{fontFamily:'monospace',fontSize:12,color:'#6b7a8d',marginBottom:6,letterSpacing:1}}>{result==='heads'?'⚾ Heads':'🏟️ Tails'}{mode==='call'&&` — ${callerName} called ${called}`}</div>
        <div style={{fontFamily:"'Bebas Neue',Arial,serif",fontSize:24,color:'#f5c842',letterSpacing:2,marginBottom:20}}>{winnerLabel(callerWon,result)}</div>
        <button style={{background:'#f5c842',color:'#0d1117',border:'none',borderRadius:7,padding:'12px 20px',fontFamily:'monospace',fontSize:12,letterSpacing:1,textTransform:'uppercase',cursor:'pointer',fontWeight:700,width:'100%'}} onClick={()=>onComplete(callerWon,result)}>{ctaLabel}</button>
      </div>)}
    </div>
  );
}
function ScoringEditor({scoring,setScoring}){
  const [open,setOpen]=useState(false);
  const batF=[
    ['hr','HR'],['triple','3B'],['double','2B'],['single','1B'],
    ['rbi','RBI'],['run','R'],['bb_bat','BB'],['hbp_bat','HBP'],
    ['sb','SB'],['cs_bat','CS'],['k_bat','K'],['gidp','GIDP'],
  ];
  const pitF=[
    ['ip','IP'],['k_pit','K'],['er','ER'],['bb_pit','BB'],['hbp_pit','HBP'],
    ['win','W'],['save','SV'],['qs','QS'],['cg','CG'],['cgso','CGSO'],['nh','NH'],
  ];
  const defF=[['putout','PO'],['assist','A'],['caught_stealing','CS'],['double_play','DP'],['error','E']];
  const defOn=!!scoring.def_enabled;
  const Row=([k,l])=>(<div key={k} style={{display:'flex',alignItems:'center',gap:6,padding:'5px 10px',background:'#1c2630',border:'1px solid #2a3540',borderRadius:6}}>
    <span style={{flex:1,fontSize:12,color:'#e8edf2'}}>{l}</span>
    <input type="number" value={scoring[k]??0} step="0.5" onChange={e=>setScoring(s=>({...s,[k]:parseFloat(e.target.value)||0}))} style={{...S.input,width:52,textAlign:'center',padding:'4px 6px',fontSize:12}}/>
  </div>);
  return(<div style={{...S.card,marginBottom:12}}>
    {}
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
      <div style={S.cardTitle}>📏 Scoring</div>
      <div style={{display:'flex',gap:6,alignItems:'center'}}>
        {open&&<button style={{...S.btnOutline,fontSize:11,padding:'4px 10px'}} onClick={e=>{e.stopPropagation();setScoring({...DSC});}}>Reset</button>}
        <button onClick={()=>setOpen(o=>!o)} style={{background:'none',border:'1px solid #2a3540',borderRadius:6,padding:'4px 10px',fontFamily:'monospace',fontSize:11,color:'#6b7a8d',cursor:'pointer'}}>{open?'Done ▲':'Edit ▼'}</button>
      </div>
    </div>
    {}
    {!open&&(
      <div style={{display:'flex',flexDirection:'column',gap:6}}>
        {}
        <div style={{display:'flex',gap:6}}>
          {[
            {label:'Offense', color:'#4a9eff'},
            {label:'Pitching', color:'#f5c842'},
          ].map(cat=>(
            <div key={cat.label} style={{flex:1,padding:'8px 10px',background:'#1c2630',border:`1px solid ${cat.color}22`,borderRadius:8,textAlign:'center'}}>
              <div style={{fontFamily:'monospace',fontSize:10,color:cat.color,letterSpacing:.5,fontWeight:700}}>{cat.label}</div>
            </div>
          ))}
          {}
          <div style={{flex:1,padding:'8px 10px',background:'#1c2630',border:`1px solid ${defOn?'rgba(61,214,140,.4)':'#2a3540'}`,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'space-between',gap:6,transition:'border .2s'}}>
            <div style={{fontFamily:'monospace',fontSize:10,color:defOn?'#3dd68c':'#6b7a8d',fontWeight:700,letterSpacing:.5}}>Fielding</div>
            <div onClick={()=>setScoring(s=>({...s,def_enabled:!s.def_enabled}))} style={{width:34,height:18,borderRadius:9,background:defOn?'#3dd68c':'#2a3540',cursor:'pointer',position:'relative',transition:'background .2s',flexShrink:0}}>
              <div style={{position:'absolute',top:1,left:defOn?15:1,width:16,height:16,borderRadius:'50%',background:defOn?'#0d1117':'#6b7a8d',transition:'left .2s'}}/>
            </div>
          </div>
        </div>
      </div>
    )}
    {}
    {open&&(<>
      <div style={{fontFamily:'monospace',fontSize:10,color:'#4a9eff',margin:'4px 0 6px',textTransform:'uppercase',letterSpacing:1}}>⚾ Offense</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5,marginBottom:12}}>{batF.map(Row)}</div>
      <div style={{fontFamily:'monospace',fontSize:10,color:'#f5c842',margin:'0 0 6px',textTransform:'uppercase',letterSpacing:1}}>⚾ Pitching</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5,marginBottom:14}}>{pitF.map(Row)}</div>
      <div style={{borderTop:'1px solid #2a3540',paddingTop:12}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:defOn?10:0}}>
          <div>
            <div style={{fontFamily:'monospace',fontSize:10,color:defOn?'#3dd68c':'#6b7a8d',textTransform:'uppercase',letterSpacing:1,fontWeight:700}}>🛡️ Fielding</div>
            <div style={{fontFamily:'monospace',fontSize:9,color:'#6b7a8d',marginTop:2}}>Optional · PO, A, CS, DP, E</div>
          </div>
          <div onClick={()=>setScoring(s=>({...s,def_enabled:!s.def_enabled}))} style={{width:44,height:24,borderRadius:12,background:defOn?'#3dd68c':'#2a3540',cursor:'pointer',position:'relative',transition:'background .2s',border:`1px solid ${defOn?'#3dd68c':'#3a4a5a'}`,flexShrink:0}}>
            <div style={{position:'absolute',top:2,left:defOn?20:2,width:18,height:18,borderRadius:'50%',background:defOn?'#0d1117':'#6b7a8d',transition:'left .2s'}}/>
          </div>
        </div>
        {defOn&&(<>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5}}>{defF.map(Row)}</div>
          <div style={{marginTop:8,padding:'8px 10px',background:'rgba(61,214,140,.06)',border:'1px solid rgba(61,214,140,.15)',borderRadius:6}}>
            <div style={{fontFamily:'monospace',fontSize:9,color:'#6b7a8d',lineHeight:1.5}}>
              <span style={{color:'#3dd68c',fontWeight:700}}>PO</span> Put Outs · <span style={{color:'#3dd68c',fontWeight:700}}>A</span> Assists · <span style={{color:'#3dd68c',fontWeight:700}}>CS</span> Caught Stealing · <span style={{color:'#3dd68c',fontWeight:700}}>DP</span> Double Play · <span style={{color:'#e84545',fontWeight:700}}>E</span> Errors
            </div>
          </div>
        </>)}
      </div>
    </>)}
  </div>);
}
function GameLogList({history, me, games}){
  const G=games||GAMES;
  const [expanded, setExpanded] = useState(null);
  return(
    <div>
      {history.map((h,i)=>{
        const g=G.find(x=>x.id===h.gameId);
        const isOpen=expanded===i;
        const resultColor=h.iWon?'#3dd68c':h.isTie?'#6b7a8d':'#e84545';
        const resultBg=h.iWon?'rgba(61,214,140,.12)':h.isTie?'rgba(107,122,141,.15)':'rgba(232,69,69,.12)';
        const myRole=h.myRole||'challenger';
        const oppRole=myRole==='challenger'?'opponent':'challenger';
        const myColor='#4a9eff', oppColor='#e84545';
        const myName=myRole==='challenger'?h.challengerName:h.opponentName;
        const oppName=myRole==='challenger'?h.opponentName:h.challengerName;
        const myPicks=h.picks?.[myRole]||[];
        const oppPicks=h.picks?.[oppRole]||[];
        return(
          <div key={i} style={{borderBottom:'1px solid rgba(42,53,64,.4)'}}>
            {}
            <div onClick={()=>setExpanded(isOpen?null:i)} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 0',cursor:'pointer'}}>
              <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',minWidth:46,flexShrink:0}}>{h.date}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600}}>vs {h.oppName}</div>
                <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',marginTop:1}}>{g?.away} @ {g?.home}</div>
              </div>
              <div style={{textAlign:'right',marginRight:6}}>
                <div style={{fontFamily:'monospace',fontSize:13,color:'#f5c842',fontWeight:700}}>{h.myScore?.toFixed(1)} – {h.oppScore?.toFixed(1)}</div>
                <div style={{fontFamily:'monospace',fontSize:10,padding:'1px 6px',borderRadius:3,display:'inline-block',marginTop:2,background:resultBg,color:resultColor}}>{h.iWon?'WIN':h.isTie?'TIE':'LOSS'}</div>
              </div>
              <div style={{color:'#6b7a8d',fontSize:11,flexShrink:0}}>{isOpen?'▲':'▼'}</div>
            </div>
            {}
            {isOpen&&(
              <div style={{paddingBottom:12}}>
                {}
                <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:10,padding:'8px 10px',background:'rgba(255,255,255,.03)',borderRadius:8,border:'1px solid #2a3540'}}>
                  <div style={{flex:1,textAlign:'center'}}>
                    <div style={{fontFamily:'monospace',fontSize:10,color:myColor,marginBottom:2}}>{myName}</div>
                    <div style={{fontFamily:"'Bebas Neue',Arial,serif",fontSize:28,color:myColor,lineHeight:1}}>{h.myScore?.toFixed(1)}</div>
                  </div>
                  <div style={{fontFamily:'monospace',fontSize:12,color:'#6b7a8d'}}>FINAL</div>
                  <div style={{flex:1,textAlign:'center'}}>
                    <div style={{fontFamily:'monospace',fontSize:10,color:oppColor,marginBottom:2}}>{oppName}</div>
                    <div style={{fontFamily:"'Bebas Neue',Arial,serif",fontSize:28,color:oppColor,lineHeight:1}}>{h.oppScore?.toFixed(1)}</div>
                  </div>
                </div>
                {}
                {(myPicks.length>0||oppPicks.length>0)?(
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
                    {[[myColor,myName,myPicks],[oppColor,oppName,oppPicks]].map(([color,name,picks])=>(
                      <div key={name} style={{background:'#141b22',border:`1px solid ${color}33`,borderRadius:8,overflow:'hidden'}}>
                        <div style={{padding:'5px 8px',background:color+'18',borderBottom:`1px solid ${color}22`}}>
                          <div style={{fontFamily:'monospace',fontSize:9,color,fontWeight:700,letterSpacing:.5}}>{name.split(' ')[0]}</div>
                        </div>
                        {picks.map((p,pi)=>(
                          <div key={pi} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'4px 8px',borderBottom:'1px solid rgba(42,53,64,.25)'}}>
                            <div>
                              <div style={{fontSize:11,fontWeight:600,color:'#e8edf2'}}>{p.name}</div>
                              <div style={{fontFamily:'monospace',fontSize:9,color:'#6b7a8d'}}>{p.pos}</div>
                            </div>
                            {p.fpts!==undefined&&(
                              <div style={{fontFamily:'monospace',fontSize:11,fontWeight:700,color:(p.fpts||0)>=0?color:'#6b7a8d',flexShrink:0}}>
                                {p.fpts>0?'+':''}{p.fpts}
                              </div>
                            )}
                          </div>
                        ))}
                        {picks.length===0&&<div style={{padding:'10px 8px',color:'#6b7a8d',fontSize:11,textAlign:'center'}}>—</div>}
                      </div>
                    ))}
                  </div>
                ):(
                  <div style={{textAlign:'center',color:'#6b7a8d',fontSize:12,padding:'10px 0'}}>Roster data not available for this game</div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
function LeaderboardTab({me, friends}){
  const [filter,setFilter]=useState('pts');
  const [allPlayers,setAllPlayers]=useState([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    const load=async()=>{
      try{
        const idx=await sget('code_index')||{};
        const uids=Object.values(idx);
        const profiles=await Promise.all(uids.map(id=>sget(`user:${id}`)));
        const valid=profiles.filter(p=>p&&p.id&&p.games>0);
        setAllPlayers(valid);
      }catch{}
      setLoading(false);
    };
    load();
  },[]);
  const realFriends=friends.filter(f=>f.id!=='bot_demo'&&f.games>0);
  const sortFn=(a,b)=>{
    if(filter==='pts') return (b.totalPts||0)-(a.totalPts||0);
    if(filter==='avg'){
      const avgA=(a.totalPts||0)/Math.max(a.games||1,1);
      const avgB=(b.totalPts||0)/Math.max(b.games||1,1);
      return avgB-avgA;
    }
    const wrA=(a.wins||0)/Math.max((a.wins||0)+(a.losses||0),1);
    const wrB=(b.wins||0)/Math.max((b.wins||0)+(b.losses||0),1);
    return wrB!==wrA?wrB-wrA:(b.wins||0)-(a.wins||0);
  };
  const statVal=(p)=>{
    if(filter==='pts') return `${(p.totalPts||0).toFixed(1)} pts`;
    if(filter==='avg') return `${((p.totalPts||0)/Math.max(p.games||1,1)).toFixed(1)} avg`;
    const wr=Math.round(((p.wins||0)/Math.max((p.wins||0)+(p.losses||0),1))*100);
    return `${p.wins||0}W · ${p.losses||0}L (${wr}%)`;
  };
  const Row=({p,rank,highlight})=>(
    <div style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:'1px solid rgba(42,53,64,.35)',background:highlight?'rgba(245,200,66,.03)':'none'}}>
      <div style={{fontFamily:'monospace',fontSize:12,fontWeight:700,color:rank===1?'#f5c842':rank===2?'#c0c0c0':rank===3?'#cd7f32':'#6b7a8d',minWidth:22,textAlign:'center'}}>{rank===1?'🥇':rank===2?'🥈':rank===3?'🥉':rank}</div>
      <div style={{fontSize:22,flexShrink:0}}>{p.avatar||'⚾'}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,fontWeight:highlight?700:600,color:highlight?'#f5c842':'#e8edf2',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.teamName||p.name}{highlight?' (You)':''}</div>
        <div style={{fontFamily:'monospace',fontSize:9,color:'#6b7a8d',marginTop:1}}>{p.games||0} games</div>
      </div>
      <div style={{fontFamily:'monospace',fontSize:12,fontWeight:700,color:highlight?'#f5c842':'#4a9eff',flexShrink:0,textAlign:'right'}}>{statVal(p)}</div>
    </div>
  );
  const globalWithMe=[me,...allPlayers.filter(p=>p.id!==me.id)].filter(p=>p.games>0);
  const sortedGlobal=[...globalWithMe].sort(sortFn);
  const myGlobalRank=sortedGlobal.findIndex(p=>p.id===me.id)+1;
  const friendsWithMe=[me,...realFriends];
  const sortedFriends=[...friendsWithMe].sort(sortFn);
  const myFriendRank=sortedFriends.findIndex(p=>p.id===me.id)+1;
  const FilterBtn=({id,label})=>(
    <button onClick={()=>setFilter(id)} style={{flex:1,padding:'7px 0',background:filter===id?'rgba(245,200,66,.1)':'none',border:`1px solid ${filter===id?'rgba(245,200,66,.3)':'#2a3540'}`,borderRadius:6,color:filter===id?'#f5c842':'#6b7a8d',fontFamily:'monospace',fontSize:10,letterSpacing:.5,cursor:'pointer'}}>{label}</button>
  );
  return(<>
    {}
    <div style={{display:'flex',gap:6,marginBottom:14}}>
      <FilterBtn id="pts" label="Total Pts"/>
      <FilterBtn id="avg" label="Avg Pts"/>
      <FilterBtn id="wl" label="W / L"/>
    </div>
    {}
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:14}}>
      {[['👥 Friends',myFriendRank,sortedFriends.length],['🌍 Global',myGlobalRank,sortedGlobal.length]].map(([label,rank,total])=>(
        <div key={label} style={{background:'#141b22',border:'1px solid rgba(245,200,66,.2)',borderRadius:10,padding:'12px',textAlign:'center'}}>
          <div style={{fontFamily:'monospace',fontSize:9,color:'#6b7a8d',letterSpacing:1,marginBottom:6}}>{label}</div>
          <div style={{fontFamily:"'Bebas Neue',Arial,serif",fontSize:36,color:'#f5c842',lineHeight:1}}>#{rank}</div>
          <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',marginTop:2}}>of {total} players</div>
        </div>
      ))}
    </div>
    {}
    {sortedFriends.length>1&&(
      <div style={S.card}>
        <div style={S.cardTitle}>👥 Friends</div>
        {sortedFriends.map((p,i)=><Row key={p.id} p={p} rank={i+1} highlight={p.id===me.id}/>)}
      </div>
    )}
    {}
    <div style={S.card}>
      <div style={S.cardTitle}>🌍 All Players</div>
      {loading?<div style={{textAlign:'center',padding:'20px 0',color:'#6b7a8d',fontFamily:'monospace',fontSize:12}}>Loading…</div>
        :sortedGlobal.length===0
          ?<div style={S.empty}>No other players found yet</div>
          :sortedGlobal.map((p,i)=><Row key={p.id} p={p} rank={i+1} highlight={p.id===me.id}/>)}
    </div>
  </>);
}
function SlidePanel({open, onClose, title, children}){
  if(!open) return null;
  return(
    <div style={{position:'fixed',inset:0,zIndex:300,display:'flex',flexDirection:'column',justifyContent:'flex-end'}}>
      <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,.6)'}} onClick={onClose}/>
      <div style={{position:'relative',background:'#141b22',borderRadius:'16px 16px 0 0',border:'1px solid #2a3540',maxHeight:'88vh',display:'flex',flexDirection:'column'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 16px 10px',borderBottom:'1px solid #2a3540',flexShrink:0}}>
          <div style={{...S.display,fontSize:18,color:'#f5c842',letterSpacing:1.5}}>{title}</div>
          <button onClick={onClose} style={{background:'none',border:'none',color:'#6b7a8d',fontSize:20,cursor:'pointer',lineHeight:1,padding:4}}>✕</button>
        </div>
        <div style={{overflowY:'auto',padding:'12px 16px 32px'}}>
          {children}
        </div>
      </div>
    </div>
  );
}
function AccountPanel({me, open, onClose, onLogout}){
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(me?.name||'');
  const [teamName, setTeamName] = useState(me?.teamName||'');
  return(
    <SlidePanel open={open} onClose={onClose} title="Account">
      {}
      <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px',background:me?.color+'11',border:`1px solid ${me?.color}33`,borderRadius:10,marginBottom:16}}>
        <div style={{fontSize:36}}>{me?.avatar}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:16,fontWeight:700,color:me?.color}}>{me?.teamName||me?.name}</div>
          <div style={{fontSize:12,color:'#8a9bb0',marginTop:1}}>{me?.name}</div>
          <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',marginTop:2}}>Join Code: <span style={{color:'#f5c842',fontWeight:700}}>{me?.joinCode}</span></div>
        </div>
      </div>
      {}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,marginBottom:16}}>
        {[['W',me?.wins||0,'#3dd68c'],['L',me?.losses||0,'#e84545'],['T',me?.ties||0,'#6b7a8d'],['Pts',(me?.totalPts||0).toFixed(0),'#f5c842']].map(([l,v,c])=>(
          <div key={l} style={{background:'#1c2630',borderRadius:8,padding:'10px 6px',textAlign:'center',border:'1px solid #2a3540'}}>
            <div style={{...S.display,fontSize:22,color:c,lineHeight:1}}>{v}</div>
            <div style={{fontFamily:'monospace',fontSize:9,color:'#6b7a8d',marginTop:2}}>{l}</div>
          </div>
        ))}
      </div>
      {}
      <div style={{...S.card,marginBottom:10}}>
        <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',letterSpacing:1,textTransform:'uppercase',marginBottom:10}}>Account Details</div>
        {[['Name',me?.name],['Team',me?.teamName],['Contact',me?.contact||'—'],['Member since','Today']].map(([l,v])=>(
          <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid rgba(42,53,64,.4)'}}>
            <span style={{fontFamily:'monospace',fontSize:11,color:'#6b7a8d'}}>{l}</span>
            <span style={{fontSize:13,color:'#e8edf2',fontWeight:500}}>{v}</span>
          </div>
        ))}
      </div>
      {}
      <button style={{...S.btnOutline,width:'100%',marginBottom:8,textAlign:'left',display:'flex',alignItems:'center',gap:10}} onClick={()=>{}}>
        <span style={{fontSize:16}}>✏️</span><span>Edit Profile</span>
      </button>
      <button style={{...S.btnOutline,width:'100%',marginBottom:8,textAlign:'left',display:'flex',alignItems:'center',gap:10}} onClick={()=>{}}>
        <span style={{fontSize:16}}>🔒</span><span>Privacy Settings</span>
      </button>
      <button onClick={onLogout} style={{...S.btnOutline,width:'100%',border:'1px solid rgba(232,69,69,.3)',color:'#e84545',display:'flex',alignItems:'center',gap:10}}>
        <span style={{fontSize:16}}>🚪</span><span>Log Out</span>
      </button>
    </SlidePanel>
  );
}
function NotificationsPanel({open, onClose, alerts}){
  const NOTIF_PREFS=[
    {key:'notif_draft',icon:'📋',label:'Draft Time',desc:'When lineups are posted and it\'s time to draft'},
    {key:'notif_turn',icon:'⚡',label:'Your Turn',desc:'When it\'s your pick in the draft'},
    {key:'notif_lead',icon:'📊',label:'Lead Changes',desc:'When your opponent takes or loses the lead'},
    {key:'notif_result',icon:'🏆',label:'Game Results',desc:'Final scores and win/loss notifications'},
    {key:'notif_challenge',icon:'⚔️',label:'New Challenges',desc:'When someone challenges you to a duel'},
    {key:'notif_lineup',icon:'⏳',label:'Lineups Posted',desc:'When game lineups are officially released'},
  ];
  const [prefs, setPrefs] = useState(()=>{
    try{ return JSON.parse(localStorage.getItem('dd_notif_prefs')||'{}'); }catch{ return {}; }
  });
  const toggle=(key)=>{
    const next={...prefs,[key]:!prefs[key]};
    setPrefs(next);
    localStorage.setItem('dd_notif_prefs',JSON.stringify(next));
  };
  return(
    <SlidePanel open={open} onClose={onClose} title="Notifications">
      {}
      {alerts&&alerts.length>0&&(<>
        <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',letterSpacing:1,textTransform:'uppercase',marginBottom:8}}>Recent</div>
        <div style={{...S.card,marginBottom:16,padding:'6px 0'}}>
          {alerts.slice(0,5).map((a,i)=>(
            <div key={i} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'8px 14px',borderBottom:i<Math.min(alerts.length,5)-1?'1px solid rgba(42,53,64,.3)':'none'}}>
              <span style={{fontSize:16,flexShrink:0}}>{a.icon||'🔔'}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:'#e8edf2'}}>{a.title}</div>
                <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',marginTop:1}}>{a.body}</div>
                <div style={{fontFamily:'monospace',fontSize:9,color:'#3a4a5a',marginTop:2}}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </>)}
      {(!alerts||alerts.length===0)&&(
        <div style={{textAlign:'center',padding:'16px 0 8px',color:'#6b7a8d',fontSize:13,marginBottom:16}}>No recent alerts</div>
      )}
      {}
      <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',letterSpacing:1,textTransform:'uppercase',marginBottom:8}}>Personalize Alerts</div>
      <div style={{...S.card,padding:'6px 0',marginBottom:0}}>
        {NOTIF_PREFS.map((pref,i)=>{
          const on=prefs[pref.key]!==false;
          return(
            <div key={pref.key} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',borderBottom:i<NOTIF_PREFS.length-1?'1px solid rgba(42,53,64,.3)':'none'}}>
              <span style={{fontSize:18,flexShrink:0}}>{pref.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:'#e8edf2'}}>{pref.label}</div>
                <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',marginTop:1}}>{pref.desc}</div>
              </div>
              <div onClick={()=>toggle(pref.key)} style={{width:44,height:24,borderRadius:12,background:on?'#3dd68c':'#2a3540',cursor:'pointer',position:'relative',transition:'background .2s',flexShrink:0}}>
                <div style={{position:'absolute',top:2,left:on?20:2,width:20,height:20,borderRadius:'50%',background:on?'#0d1117':'#6b7a8d',transition:'left .2s'}}/>
              </div>
            </div>
          );
        })}
      </div>
    </SlidePanel>
  );
}
function NewGameButtons({onNav}){
  const [visible,setVisible]=useState(true);
  const lastY=useRef(0);
  useEffect(()=>{
    const onScroll=()=>{
      const y=window.scrollY;
      if(y<80) setVisible(true);
      else if(y<lastY.current) setVisible(true);
      else if(y>lastY.current+4) setVisible(false);
      lastY.current=y;
    };
    window.addEventListener('scroll',onScroll,{passive:true});
    return()=>window.removeEventListener('scroll',onScroll);
  },[]);
  return(
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,margin:'10px 0 12px',transition:'opacity .25s, transform .25s',opacity:visible?1:0,transform:visible?'translateY(0)':'translateY(-8px)',pointerEvents:visible?'auto':'none'}}>
      <button style={{...S.actionCard,padding:'10px 8px'}} onClick={()=>onNav('challenge')}>
        <div style={{fontSize:18,marginBottom:3}}>⚔️</div>
        <div style={{...S.display,fontSize:10,letterSpacing:.8,color:'#f5c842',lineHeight:1.2}}>SINGLE GAME</div>
      </button>
      <button style={{...S.actionCard,padding:'10px 8px'}} onClick={()=>onNav('challenge-series')}>
        <div style={{fontSize:18,marginBottom:3}}>🔁</div>
        <div style={{...S.display,fontSize:10,letterSpacing:.8,color:'#4a9eff',lineHeight:1.2}}>SERIES</div>
      </button>
      <button style={{...S.actionCard,padding:'10px 8px',opacity:.55,cursor:'default'}}>
        <div style={{fontSize:18,marginBottom:3}}>🏆</div>
        <div style={{...S.display,fontSize:10,letterSpacing:.8,color:'#3dd68c',lineHeight:1.2}}>PLAYOFFS</div>
      </button>
    </div>
  );
}
function HomeScreen({me,friends,challenges,onNav,onOpenDuel,onDemo,refresh,showToast,games,onLogout,onOpenSeries,activeSeries}){
  const G=games||GAMES;
  const [tab,setTab]=useState('duels');
  const [chatDuel,setChatDuel]=useState(null);
  const [showAccount,setShowAccount]=useState(false);
  const [showNotifs,setShowNotifs]=useState(false);
  const alerts=JSON.parse(localStorage.getItem('dd_alerts')||'[]');
  const unreadNotifs=alerts.filter(a=>!a.read).length;
  const pending=challenges.filter(c=>c.dir==='in'&&c.status==='pending');
  const allActive=challenges.filter(c=>c.status==='drafting'||c.status==='active'||c.status==='simulating');
  const myHistory=JSON.parse(localStorage.getItem('dd_my_history')||'[]');
  const acceptChallenge=async(c)=>{
    const game=G.find(g=>g.id===c.gameId); if(!game)return;
    const r1slots=buildSlotsForRound(game,1);
    const r1order=buildOrder(c.coinWinner,r1slots,c.draftMode||'position');
    const duel={id:c.duelId,challengerId:c.challengerId,opponentId:c.opponentId,challengerName:c.challengerName,opponentName:me.name,gameId:c.gameId,draftMode:c.draftMode||'position',scoring:c.scoring||DSC,slots:r1slots,order:r1order,pickIdx:0,assignments:{},takenIds:[],picks:{challenger:[],opponent:[]},pickLog:[],status:'drafting',draftRound:1,firstPick:c.coinWinner,r2firstPick:null};
    await sset(`duel:${c.duelId}`,duel);
    const inbox=(await sget(`challenges:${me.id}`))||[];
    await sset(`challenges:${me.id}`,inbox.filter(x=>x.duelId!==c.duelId));
    const sent=(await sget(`challenges_sent:${c.challengerId}`))||[];
    await sset(`challenges_sent:${c.challengerId}`,sent.map(x=>x.duelId===c.duelId?{...x,status:'drafting',opponentName:me.name}:x));
    refresh(); showToast('Challenge accepted! Draft time!'); onOpenDuel(c.duelId);
  };
  const Tab=({id,label})=>(<button onClick={()=>setTab(id)} style={{flex:1,padding:'8px 2px',background:'none',border:'none',borderBottom:`2px solid ${tab===id?'#f5c842':'transparent'}`,color:tab===id?'#f5c842':'#6b7a8d',fontFamily:'monospace',fontSize:10,letterSpacing:.5,textTransform:'uppercase',cursor:'pointer',whiteSpace:'nowrap'}}>{label}</button>);
  return(<div style={S.page}>
    {chatDuel&&<DuelChat duelId={chatDuel.duelId} me={me} opponentName={chatDuel.opponentName} onClose={()=>setChatDuel(null)}/>}
    <AccountPanel me={me} open={showAccount} onClose={()=>setShowAccount(false)} onLogout={onLogout}/>
    <NotificationsPanel open={showNotifs} onClose={()=>setShowNotifs(false)} alerts={alerts}/>
    {}
    <div style={{position:'sticky',top:0,zIndex:100,background:'rgba(13,17,23,.95)',backdropFilter:'blur(12px)',WebkitBackdropFilter:'blur(12px)',borderBottom:'1px solid rgba(42,53,64,.6)'}}>
      <div style={{maxWidth:430,margin:'0 auto',padding:'10px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{...S.display,fontSize:24,color:'#f5c842',letterSpacing:2,lineHeight:1}}>DIAMOND DUEL</div>
          <div style={{fontFamily:'monospace',fontSize:9,color:'#6b7a8d',letterSpacing:1.5}}>FANTASY BASEBALL</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:4}}>
          {}
          <button onClick={()=>{setShowNotifs(true);setShowAccount(false);}} style={{background:'none',border:'none',cursor:'pointer',position:'relative',padding:'6px',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={showNotifs?'#f5c842':'#8a9bb0'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {(unreadNotifs>0||pending.length>0)&&<div style={{position:'absolute',top:4,right:4,width:8,height:8,borderRadius:'50%',background:'#e84545',border:'1.5px solid #0d1117'}}/>}
          </button>
          {}
          <button onClick={()=>{setShowAccount(true);setShowNotifs(false);}} style={{background:'none',border:'none',cursor:'pointer',padding:'6px',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={showAccount?'#f5c842':'#8a9bb0'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
        </div>
      </div>
      {}
      <div style={{maxWidth:430,margin:'0 auto',display:'flex',borderTop:'1px solid rgba(42,53,64,.5)'}}>
        <Tab id="duels" label="⚾ Duels"/>
        <Tab id="record" label="📋 Record"/>
        <Tab id="leaderboard" label="🏆 Board"/>
        <Tab id="friends" label="👥 Friends"/>
      </div>
    </div>
    {}
    <div style={{maxWidth:430,margin:'0 auto',padding:'0 16px 32px'}}>
      {}
      {(()=>{
        const efficiencies=myHistory.map(h=>h.draftEfficiency).filter(e=>typeof e==='number'&&!isNaN(e));
        const lifetimeEff=efficiencies.length>0?Math.round(efficiencies.reduce((a,b)=>a+b,0)/efficiencies.length):null;
        const effColor=lifetimeEff==null?'#6b7a8d':lifetimeEff>=80?'#3dd68c':lifetimeEff>=60?'#f5c842':'#e84545';
        return(
          <div style={{...S.card,border:`1px solid ${me.color}44`,background:'linear-gradient(135deg,#1c2630,#141b22)',marginBottom:0,marginTop:8}}>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:10}}>
              <div style={{fontSize:34}}>{me.avatar}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:15,fontWeight:700,color:me.color}}>{me.teamName||me.name}</div>
                <div style={{fontSize:11,color:'#8a9bb0',marginTop:1}}>{me.name}</div>
                <div style={{fontFamily:'monospace',fontSize:9,color:'#6b7a8d',marginTop:2}}>CODE: <span style={{color:'#f5c842',fontWeight:700}}>{me.joinCode}</span></div>
              </div>
              <div style={{display:'flex',gap:8}}>
                {[['W',me.wins||0,'#3dd68c'],['L',me.losses||0,'#e84545'],['T',me.ties||0,'#6b7a8d']].map(([l,v,c])=>(
                  <div key={l} style={{textAlign:'center'}}>
                    <div style={{...S.display,fontSize:22,color:c,lineHeight:1}}>{v}</div>
                    <div style={{fontFamily:'monospace',fontSize:8,color:'#6b7a8d'}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{height:'1px',background:'rgba(42,53,64,.6)',marginBottom:8}}/>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div>
                <div style={{fontFamily:'monospace',fontSize:8,color:'#6b7a8d',letterSpacing:1,textTransform:'uppercase',marginBottom:2}}>Total Record</div>
                <div style={{fontFamily:'monospace',fontSize:11,color:'#e8edf2',fontWeight:600}}>
                  {me.wins||0}W · {me.losses||0}L · {me.ties||0}T
                  <span style={{color:'#6b7a8d',fontWeight:400}}> · all games</span>
                </div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontFamily:'monospace',fontSize:8,color:'#6b7a8d',letterSpacing:1,textTransform:'uppercase',marginBottom:2}}>Draft Efficiency</div>
                {lifetimeEff!=null?(
                  <div style={{display:'flex',alignItems:'center',gap:6,justifyContent:'flex-end'}}>
                    <div style={{width:48,height:5,background:'#1c2630',borderRadius:3,overflow:'hidden'}}>
                      <div style={{height:'100%',width:`${lifetimeEff}%`,background:effColor,borderRadius:3}}/>
                    </div>
                    <div style={{fontFamily:'monospace',fontSize:12,color:effColor,fontWeight:700}}>{lifetimeEff}%</div>
                  </div>
                ):(
                  <div style={{fontFamily:'monospace',fontSize:10,color:'#3a4a5a'}}>—</div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
      {}
      <NewGameButtons onNav={onNav}/>
    {}
    {tab==='duels'&&(<>
      {pending.length>0&&(<div style={S.card}><div style={S.cardTitle}>⚡ Incoming Challenges</div>
        {pending.map(c=>(<div key={c.duelId} style={{...S.row,marginBottom:8}}>
          <div style={{fontSize:22,marginRight:10}}>{friends.find(f=>f.id===c.challengerId)?.avatar||'⚾'}</div>
          <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{c.challengerName} challenged you!</div><div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',marginTop:2}}>{G.find(g=>g.id===c.gameId)?.awayFull} @ {G.find(g=>g.id===c.gameId)?.homeFull}</div></div>
          <button style={S.btnGold} onClick={()=>acceptChallenge(c)}>Accept</button>
        </div>))}
      </div>)}
      {challenges.filter(c=>c.status==='lineup_pending').length>0&&(<div style={{...S.card,border:'1px solid rgba(245,200,66,.2)',background:'rgba(245,200,66,.03)',marginBottom:10}}>
        <div style={S.cardTitle}>⏳ Waiting for Lineups</div>
        {challenges.filter(c=>c.status==='lineup_pending').map(c=>{
          const g=G.find(x=>x.id===c.gameId); const isOut=c.dir==='out';
          return(<div key={c.duelId} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:'1px solid rgba(42,53,64,.4)'}}>
            <div style={{fontSize:20,marginRight:2}}>⏳</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:600}}>{isOut?`vs ${c.opponentName||'Opponent'}`:`${c.challengerName} challenged you`}</div>
              <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',marginTop:1}}>{g?.awayFull} @ {g?.homeFull} · {g?.time}</div>
              <div style={{fontFamily:'monospace',fontSize:9,color:'#f5c842',marginTop:2}}>We'll notify you the moment lineups are posted</div>
            </div>
          </div>);
        })}
      </div>)}
      {allActive.length>0&&(<div style={S.card}><div style={S.cardTitle}>🔥 Active Duels</div>
        {allActive.map(c=>{
          const oN=c.dir==='out'?(c.opponentName||'Waiting…'):c.challengerName;
          const oA=friends.find(f=>f.id===(c.dir==='out'?c.opponentId:c.challengerId))?.avatar||'⚾';
          return(<div key={c.duelId} style={{...S.row,marginBottom:8}}>
            <div style={{fontSize:22,marginRight:10,cursor:'pointer'}} onClick={()=>onOpenDuel(c.duelId)}>{oA}</div>
            <div style={{flex:1,cursor:'pointer'}} onClick={()=>onOpenDuel(c.duelId)}><div style={{fontWeight:600,fontSize:13}}>vs {oN}</div><div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',marginTop:2}}>{c.status==='drafting'?'📋 Drafting':'⚾ In progress'}</div></div>
            <button onClick={()=>setChatDuel({duelId:c.duelId,opponentName:oN})} style={{background:'#1c2630',border:'1px solid #2a3540',borderRadius:6,padding:'5px 8px',cursor:'pointer',fontSize:14,marginRight:6}}>💬</button>
            <div style={{color:'#4a9eff',fontFamily:'monospace',fontSize:12,cursor:'pointer'}} onClick={()=>onOpenDuel(c.duelId)}>→</div>
          </div>);
        })}
      </div>)}
      {pending.length===0&&allActive.length===0&&challenges.filter(c=>c.status==='lineup_pending').length===0&&<div style={{...S.empty,paddingTop:8}}>No active duels. Tap a button above to start one!</div>}
      {/* Active series */}
      {activeSeries&&activeSeries.length>0&&(<div style={S.card}><div style={S.cardTitle}>🔁 Active Series</div>
        {activeSeries.map(s=>{
          const myR=s.challengerId===me.id?'challenger':'opponent';
          const oppR=myR==='challenger'?'opponent':'challenger';
          const mW=myR==='challenger'?s.challengerWins:s.opponentWins;
          const oW=myR==='challenger'?s.opponentWins:s.challengerWins;
          const oppN=myR==='challenger'?s.opponentName:s.challengerName;
          const toWin=Math.ceil(s.numGames/2);
          const done=mW>=toWin||oW>=toWin;
          return(<div key={s.id} onClick={()=>onOpenSeries(s.id)} style={{...S.row,cursor:'pointer',marginBottom:6}}>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:600}}>vs {oppN} · {s.numGames}-game series</div>
              <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',marginTop:1}}>{done?(mW>=toWin?'🏆 You won':'😬 They won'):`${mW}–${oW} · First to ${toWin}`}</div>
            </div>
            <div style={{display:'flex',gap:4,alignItems:'center'}}>
              {s.games.slice(0,s.numGames).map((g,i)=>(
                <div key={i} style={{width:14,height:14,borderRadius:2,background:g.winner===myR?'#4a9eff':g.winner===oppR?'#e84545':g.status==='drafting'?'#f5c842':'#2a3540'}}/>
              ))}
              <span style={{color:'#4a9eff',fontFamily:'monospace',fontSize:12,marginLeft:4}}>→</span>
            </div>
          </div>);
        })}
      </div>)}
    </>)}
    {/* ── RECORD TAB ── */}
    {tab==='record'&&(()=>{
      const seriesComplete=(activeSeries||[]).filter(s=>s.status==='complete');
      const seriesWins=seriesComplete.filter(s=>{
        const myR=s.challengerId===me.id?'challenger':'opponent';
        const toW=Math.ceil(s.numGames/2);
        return (myR==='challenger'?s.challengerWins:s.opponentWins)>=toW;
      }).length;
      const seriesLosses=seriesComplete.filter(s=>{
        const myR=s.challengerId===me.id?'challenger':'opponent';
        const toW=Math.ceil(s.numGames/2);
        return (myR==='challenger'?s.opponentWins:s.challengerWins)>=toW;
      }).length;
      const seriesTies=Math.max(0,seriesComplete.length-seriesWins-seriesLosses);
      const seriesSweeps=seriesComplete.filter(s=>{
        const myR=s.challengerId===me.id?'challenger':'opponent';
        const oppR=myR==='challenger'?'opponent':'challenger';
        return s.games.every(g=>g.status==='complete'&&g.winner===myR);
      }).length;
      const seriesSwept=seriesComplete.filter(s=>{
        const myR=s.challengerId===me.id?'challenger':'opponent';
        const oppR=myR==='challenger'?'opponent':'challenger';
        return s.games.every(g=>g.status==='complete'&&g.winner===oppR);
      }).length;
      return(<>
        {/* ── Game Record ── */}
        <div style={S.card}>
          <div style={S.cardTitle}>⚾ Game Record</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:12}}>
            {[['Wins',me.wins||0,'#3dd68c'],['Losses',me.losses||0,'#e84545'],['Ties',me.ties||0,'#6b7a8d']].map(([l,v,c])=>(
              <div key={l} style={{background:'#1c2630',border:`1px solid ${c}22`,borderRadius:8,padding:'12px 8px',textAlign:'center'}}>
                <div style={{...S.display,fontSize:32,color:c,lineHeight:1}}>{v}</div>
                <div style={{fontFamily:'monospace',fontSize:9,color:'#6b7a8d',marginTop:3,letterSpacing:.5}}>{l.toUpperCase()}</div>
              </div>
            ))}
          </div>
          <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',textAlign:'center',marginBottom:10}}>All games · single, series &amp; playoffs</div>
          {myHistory.length===0
            ?<div style={S.empty}>No games played yet. Start a duel!</div>
            :<GameLogList history={myHistory} me={me} games={games}/>}
        </div>
        {/* ── Series Record ── */}
        <div style={S.card}>
          <div style={S.cardTitle}>🔁 Series Record</div>
          {/* W / L / T row */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:8}}>
            {[['Series W',seriesWins,'#3dd68c'],['Series L',seriesLosses,'#e84545'],['Series T',seriesTies,'#6b7a8d']].map(([l,v,c])=>(
              <div key={l} style={{background:'#1c2630',border:`1px solid ${c}22`,borderRadius:8,padding:'12px 8px',textAlign:'center'}}>
                <div style={{...S.display,fontSize:28,color:c,lineHeight:1}}>{v}</div>
                <div style={{fontFamily:'monospace',fontSize:8,color:'#6b7a8d',marginTop:3,letterSpacing:.5}}>{l.toUpperCase()}</div>
              </div>
            ))}
          </div>
          {/* Sweeps / Swept row */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
            {[['🧹 Sweeps',seriesSweeps,'#3dd68c','rgba(61,214,140,.08)'],['😵 Swept',seriesSwept,'#e84545','rgba(232,69,69,.06)']].map(([l,v,c,bg])=>(
              <div key={l} style={{background:bg,border:`1px solid ${c}22`,borderRadius:8,padding:'10px 8px',textAlign:'center'}}>
                <div style={{...S.display,fontSize:26,color:c,lineHeight:1}}>{v}</div>
                <div style={{fontFamily:'monospace',fontSize:8,color:c,opacity:.7,marginTop:3,letterSpacing:.5}}>{l}</div>
              </div>
            ))}
          </div>
          {seriesComplete.length===0&&<div style={S.empty}>No completed series yet</div>}
          {seriesComplete.map(s=>{
            const myR=s.challengerId===me.id?'challenger':'opponent';
            const oppR=myR==='challenger'?'opponent':'challenger';
            const mW=myR==='challenger'?s.challengerWins:s.opponentWins;
            const oW=myR==='challenger'?s.opponentWins:s.challengerWins;
            const toW=Math.ceil(s.numGames/2);
            const won=mW>=toW;
            const swept=s.games.every(g=>g.status==='complete'&&g.winner===myR);
            const wasSwept=s.games.every(g=>g.status==='complete'&&g.winner===oppR);
            const oppN=myR==='challenger'?s.opponentName:s.challengerName;
            return(
              <div key={s.id} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:'1px solid rgba(42,53,64,.3)'}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600}}>{s.awayFull} vs {s.homeFull}</div>
                  <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',marginTop:1}}>vs {oppN} · {s.numGames} games</div>
                </div>
                <div style={{fontFamily:'monospace',fontSize:11,fontWeight:700,color:won?'#3dd68c':'#e84545'}}>{mW}–{oW}</div>
                <div style={{fontFamily:'monospace',fontSize:10,padding:'2px 7px',borderRadius:3,background:swept?'rgba(61,214,140,.18)':wasSwept?'rgba(232,69,69,.18)':won?'rgba(61,214,140,.12)':'rgba(232,69,69,.12)',color:swept?'#3dd68c':wasSwept?'#e84545':won?'#3dd68c':'#e84545'}}>
                  {swept?'🧹 SWEEP':wasSwept?'😵 SWEPT':won?'WIN':'LOSS'}
                </div>
              </div>
            );
          })}
        </div>
        {/* ── Tournament Record ── */}
        <div style={S.card}>
          <div style={S.cardTitle}>🏆 Playoffs Record</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:8}}>
            {[['🥇 1st',0,'#f5c842'],['🥈 2nd',0,'#c0c0c0'],['🥉 3rd',0,'#cd7f32']].map(([l,v,c])=>(
              <div key={l} style={{background:'#1c2630',border:'1px solid #2a3540',borderRadius:8,padding:'12px 8px',textAlign:'center'}}>
                <div style={{...S.display,fontSize:28,color:c,lineHeight:1}}>{v}</div>
                <div style={{fontFamily:'monospace',fontSize:8,color:'#6b7a8d',marginTop:3,letterSpacing:.5}}>{l}</div>
              </div>
            ))}
          </div>
          <div style={S.empty}>Playoffs coming soon</div>
        </div>
      </>);
    })()}
    {/* ── LEADERBOARD TAB ── */}
    {tab==='leaderboard'&&<LeaderboardTab me={me} friends={friends}/>}
    {/* ── FRIENDS TAB ── */}
    {tab==='friends'&&(<div style={S.card}>
      <div style={{...S.cardTitle,justifyContent:'space-between'}}><span>👥 Friends ({friends.filter(f=>f.id!=='bot_demo').length})</span><button style={{...S.btnOutline,fontSize:11,padding:'4px 10px'}} onClick={()=>onNav('friends')}>Manage</button></div>
      {friends.filter(f=>f.id!=='bot_demo').length===0
        ?<div style={S.empty}>No friends yet. Share your code: <span style={{color:'#f5c842',fontWeight:700}}>{me.joinCode}</span></div>
        :friends.filter(f=>f.id!=='bot_demo').map(f=>(
          <div key={f.id} style={{...S.friendRow,cursor:'default'}}>
            <div style={{fontSize:22,marginRight:10}}>{f.avatar}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:600,color:f.color}}>{f.name}</div>
              <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d'}}>{f.wins||0}W · {f.losses||0}L · {f.totalPts?Math.round((f.totalPts/(f.games||1))*10)/10:'—'} avg pts</div>
            </div>
          </div>
        ))}
    </div>)}
    </div>
  </div>);
}
function FriendsScreen({me,friends,onNav,refresh,showToast}){
  const [code,setCode]=useState('');const [busy,setBusy]=useState(false);
  const addFriend=async()=>{
    const t=code.trim().toUpperCase(); if(!t)return; setBusy(true);
    try{
      const idx=await sget('code_index'); const uid=idx?.[t];
      if(!uid){showToast('Code not found');setBusy(false);return;}
      if(uid===me.id){showToast("That's your own code!");setBusy(false);return;}
      const fl=JSON.parse(localStorage.getItem('dd_friends')||'[]');
      if(fl.includes(uid)){showToast('Already friends!');setBusy(false);return;}
      fl.push(uid); localStorage.setItem('dd_friends',JSON.stringify(fl));
      refresh(); showToast('Friend added!'); setCode('');
    }finally{setBusy(false);}
  };
  return(<div style={S.page}><div style={S.wrap}>
    <div style={S.header}><button style={S.backBtn} onClick={()=>onNav('home')}>← Back</button><div style={{...S.display,fontSize:22,color:'#f5c842',letterSpacing:2}}>FRIENDS</div><div style={{width:60}}/></div>
    <div style={S.card}><div style={S.cardTitle}>Add Friend</div>
      <div style={S.label}>Enter their join code</div>
      <input style={S.input} value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="e.g. AB3XY" maxLength={5}/>
      <button style={{...S.btnGold,width:'100%',marginTop:10}} onClick={addFriend} disabled={busy}>{busy?'Searching…':'Add Friend'}</button>
    </div>
    <div style={S.card}><div style={S.cardTitle}>Your Code</div>
      <div style={{fontFamily:'monospace',fontSize:28,color:'#f5c842',letterSpacing:6,textAlign:'center',padding:'8px 0'}}>{me.joinCode}</div>
      <div style={{fontSize:12,color:'#6b7a8d',textAlign:'center'}}>Share this with friends so they can add you</div>
    </div>
    <div style={S.card}><div style={S.cardTitle}>Friends ({friends.filter(f=>f.id!=='bot_demo').length})</div>
      {friends.filter(f=>f.id!=='bot_demo').length===0?<div style={S.empty}>No friends yet!</div>
        :friends.filter(f=>f.id!=='bot_demo').map(f=>(<div key={f.id} style={S.friendRow}>
          <div style={{fontSize:22,marginRight:10}}>{f.avatar}</div>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:f.color}}>{f.name}</div><div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d'}}>{f.wins||0}W · {f.losses||0}L · Code: {f.joinCode}</div></div>
        </div>))}
    </div>
  </div></div>);
}
function QRCode({value, size=160}){
  const N=21;
  const hash=(s,seed=0)=>{let h=seed^2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=(h*16777619)>>>0;}return h;};
  const cells=[];
  for(let r=0;r<N;r++){
    cells[r]=[];
    for(let c=0;c<N;c++){
      const inTL=r<7&&c<7, inTR=r<7&&c>N-8, inBL=r>N-8&&c<7;
      if(inTL||inTR||inBL){
        const lr=inTL?r:inTR?r:r-(N-7);
        const lc=inTL?c:inTR?c-(N-7):c;
        const onRing=(lr===0||lr===6||lc===0||lc===6);
        const inCenter=(lr>=2&&lr<=4&&lc>=2&&lc<=4);
        cells[r][c]=onRing||inCenter?1:0;
      } else if(r===7||c===7||(r<8&&(c===7))||(c<8&&r===7)){
        cells[r][c]=0;
      } else {
        cells[r][c]=hash(value,r*N+c)%2;
      }
    }
  }
  const cs=size/N;
  return(
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{display:'block',borderRadius:6,background:'#fff'}}>
      <rect width={size} height={size} fill="#fff"/>
      {cells.map((row,r)=>row.map((on,c)=>on?(
        <rect key={`${r}_${c}`} x={c*cs} y={r*cs} width={cs} height={cs} fill="#0d1117"/>
      ):null))}
    </svg>
  );
}
function SeriesChallengeScreen({me,friends,onNav,refresh,showToast,games,gamesLoading,onDemo}){
  const bot=friends.find(f=>f.id==='bot_demo');
  const [step,setStep]=useState(0);
  const [inviteMode,setInviteMode]=useState('friends');
  const [opp,setOpp]=useState(null);
  const [selectedSeries,setSelectedSeries]=useState(null);
  const [draftMode,setDraftMode]=useState('position');
  const [scoring,setScoring]=useState({...DSC});
  const [pendingSeries,setPendingSeries]=useState(null);
  const [copied,setCopied]=useState(false);
  const realFriends=friends.filter(f=>f.id!=='bot_demo');
  const numGames=selectedSeries?.games?.length||3;
  const sendSeries=async(coinWinner)=>{
    if(!opp||!selectedSeries)return;
    const seriesId='series_'+Math.random().toString(36).slice(2,12);
    const gameEntries=selectedSeries.games.map((g,i)=>({
      gameNum:i+1,gameId:g.gameId,gameData:g,date:g.date,dayLabel:g.dayLabel,
      duelId:null,status:'awaiting_lineup',winner:null,challengerScore:null,opponentScore:null,
    }));
    const series={
      id:seriesId,type:'series',seriesLabel:selectedSeries.label,
      awayFull:selectedSeries.awayFull,homeFull:selectedSeries.homeFull,
      away:selectedSeries.away,home:selectedSeries.home,
      challengerId:me.id,challengerName:me.name,
      opponentId:opp.id,opponentName:opp.name,
      numGames,draftMode,scoring,coinWinner,
      status:'pending',challengerWins:0,opponentWins:0,
      games:gameEntries,createdAt:Date.now(),
    };
    await sset(`series:${seriesId}`,series);
    const inbox=(await sget(`series_inbox:${opp.id}`))||[]; inbox.push(series); await sset(`series_inbox:${opp.id}`,inbox);
    const sent=(await sget(`series_sent:${me.id}`))||[]; sent.push({...series,dir:'out'}); await sset(`series_sent:${me.id}`,sent);
    refresh();
    return series;
  };
  const inviteText=()=>{
    return `⚾ ${me.name} challenged you to a Diamond Duel Series!\n\n${selectedSeries?.awayFull} vs ${selectedSeries?.homeFull} — ${numGames}-game series\n${draftMode==='position'?'By Position':'No Limits'} draft\n\nOpen Diamond Duel and enter join code: ${me.joinCode}\nThen accept the series challenge from ${me.name}.`;
  };
  const shareInvite=async()=>{const t=inviteText();if(navigator.share){try{await navigator.share({title:'Diamond Duel Series',text:t});}catch{}}else{await navigator.clipboard.writeText(t).catch(()=>{});setCopied(true);setTimeout(()=>setCopied(false),2500);}};
  const copyInvite=async()=>{await navigator.clipboard.writeText(inviteText()).catch(()=>{});setCopied(true);setTimeout(()=>setCopied(false),2500);};
  const backStep=()=>{
    if(step===3){onNav('home');return;}
    if(step===0)onNav('home');
    else setStep(s=>s-1);
  };
  return(<div style={S.page}><div style={S.wrap}>
    <div style={S.header}>
      <button style={S.backBtn} onClick={backStep}>← {step===3?'Home':'Back'}</button>
      <div style={{...S.display,fontSize:22,color:'#4a9eff',letterSpacing:2}}>NEW SERIES</div>
      <div style={{width:60}}/>
    </div>
    {/* ── STEP 0: Choose opponent — identical to ChallengeScreen ── */}
    {step===0&&(<>
      <div style={{display:'flex',gap:0,marginBottom:14,background:'#1c2630',border:'1px solid #2a3540',borderRadius:8,overflow:'hidden'}}>
        {[['friends','👥 Friends'],['new','✉️ Invite New']].map(([v,label])=>(
          <button key={v} onClick={()=>setInviteMode(v)} style={{flex:1,padding:'10px 0',background:inviteMode===v?'rgba(74,158,255,.1)':'none',border:'none',borderRight:v==='friends'?'1px solid #2a3540':'none',color:inviteMode===v?'#4a9eff':'#6b7a8d',fontFamily:'monospace',fontSize:12,letterSpacing:.5,cursor:'pointer',fontWeight:inviteMode===v?700:400}}>{label}</button>
        ))}
      </div>
      {inviteMode==='friends'&&(<div style={S.card}>
        <div style={S.cardTitle}>⚔️ Who are you challenging?</div>
        {realFriends.length===0
          ?(<div style={{textAlign:'center',padding:'12px 0'}}><div style={{fontSize:13,color:'#6b7a8d',marginBottom:12}}>No friends added yet.</div><button onClick={()=>setInviteMode('new')} style={{...S.btnGold,padding:'8px 20px'}}>Invite Someone →</button></div>)
          :realFriends.map(f=>(<div key={f.id} onClick={()=>setOpp(f)} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',border:`2px solid ${opp?.id===f.id?f.color:'#2a3540'}`,borderRadius:8,marginBottom:8,cursor:'pointer',background:opp?.id===f.id?f.color+'11':'#1c2630'}}>
            <div style={{fontSize:26}}>{f.avatar}</div>
            <div style={{flex:1}}><div style={{fontWeight:600,color:f.color}}>{f.name}</div><div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d'}}>{f.wins||0}W · {f.losses||0}L</div></div>
            {opp?.id===f.id&&<div style={{color:f.color,fontWeight:700}}>✓</div>}
          </div>))}
        {opp&&<button style={{...S.btnGold,width:'100%',marginTop:4}} onClick={()=>setStep(1)}>Next →</button>}
      </div>)}
      {inviteMode==='new'&&(<div style={S.card}>
        <div style={S.cardTitle}>📲 Invite a Friend</div>
        <div style={{fontSize:13,color:'#8a9bb0',lineHeight:1.6,marginBottom:14}}>Share your join code so they can add you, then come back to challenge them.</div>
        <div style={{textAlign:'center',padding:'14px',background:'rgba(245,200,66,.06)',border:'1px solid rgba(245,200,66,.2)',borderRadius:10,marginBottom:14}}>
          <div style={{fontFamily:'monospace',fontSize:11,color:'#6b7a8d',letterSpacing:1,marginBottom:6}}>YOUR JOIN CODE</div>
          <div style={{fontFamily:"'Bebas Neue',Arial,serif",fontSize:44,color:'#f5c842',letterSpacing:8}}>{me.joinCode}</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          <button onClick={shareInvite} style={{...S.btnGold,display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'11px 0'}}><span>💬</span><span>Send Text</span></button>
          <button onClick={copyInvite} style={{...S.btnOutline,display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'11px 0'}}><span>{copied?'✅':'📋'}</span><span style={{fontFamily:'monospace',fontSize:12}}>{copied?'Copied!':'Copy'}</span></button>
        </div>
      </div>)}
      <div style={{display:'flex',alignItems:'center',gap:10,marginTop:6}}>
        <div style={{flex:1,height:'1px',background:'#2a3540'}}/><span style={{fontFamily:'monospace',fontSize:10,color:'#3a4a5a',letterSpacing:1}}>OR</span><div style={{flex:1,height:'1px',background:'#2a3540'}}/>
      </div>
      <button onClick={()=>{
        const botFriend={id:'bot_demo',name:'Demo Bot 🤖',avatar:'🤖',color:'#c084fc',joinCode:'DEMO0',wins:3,losses:2,ties:0,games:5,totalPts:142};
        setOpp(botFriend);
        setStep(1);
      }} style={{width:'100%',marginTop:10,display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:'rgba(192,132,252,.06)',border:'1px solid rgba(192,132,252,.25)',borderRadius:10,cursor:'pointer'}}>
        <span style={{fontSize:24}}>🤖</span>
        <div style={{textAlign:'left',flex:1}}><div style={{...S.display,fontSize:13,letterSpacing:1,color:'#c084fc'}}>DEMO SERIES VS BOT</div><div style={{fontSize:11,color:'#6b7a8d',marginTop:2}}>Test the full flow solo</div></div>
        <span style={{color:'#c084fc',fontFamily:'monospace',fontSize:13}}>→</span>
      </button>
    </>)}
    {/* ── STEP 1: Series selection + settings — mirrors game selection ── */}
    {step===1&&(<>
      <div style={S.card}><div style={S.cardTitle}>🔁 Select Series</div>
        {DUMMY_SERIES.map(ds=>{
          const isSel=selectedSeries?.id===ds.id;
          return(
            <div key={ds.id} onClick={()=>setSelectedSeries(ds)} style={{padding:'14px',border:`2px solid ${isSel?'#4a9eff':'#2a3540'}`,borderRadius:12,cursor:'pointer',background:isSel?'rgba(74,158,255,.05)':'#141b22',marginBottom:10,transition:'all .15s'}}>
              <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:8}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:700,color:isSel?'#4a9eff':'#e8edf2'}}>{ds.awayFull}</div>
                  <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',margin:'2px 0 6px'}}>vs {ds.homeFull}</div>
                  <div style={{fontFamily:'monospace',fontSize:9,color:'#3a4a5a'}}>{ds.games[0].awaySP.name} vs {ds.games[0].homeSP.name} · G1</div>
                </div>
                <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4,flexShrink:0,marginLeft:10}}>
                  <div style={{fontFamily:'monospace',fontSize:10,padding:'3px 8px',borderRadius:4,background:isSel?'rgba(74,158,255,.15)':'rgba(74,158,255,.08)',color:'#4a9eff',fontWeight:700}}>{ds.games.length} Games</div>
                  <div style={{fontFamily:'monospace',fontSize:9,padding:'2px 6px',borderRadius:3,background:'rgba(42,53,64,.3)',color:'#6b7a8d'}}>First to {Math.ceil(ds.games.length/2)}</div>
                </div>
              </div>
              <div style={{display:'flex',gap:5}}>
                {ds.games.map((g,i)=>(
                  <div key={i} style={{flex:1,background:'#0d1117',borderRadius:6,padding:'5px 4px',textAlign:'center',border:`1px solid ${isSel?'rgba(74,158,255,.2)':'#2a3540'}`}}>
                    <div style={{fontFamily:'monospace',fontSize:8,color:'#6b7a8d'}}>{g.dayLabel}</div>
                    <div style={{fontFamily:'monospace',fontSize:9,color:'#e8edf2',fontWeight:700,marginTop:1}}>G{i+1}</div>
                    <div style={{fontFamily:'monospace',fontSize:8,color:'#6b7a8d',marginTop:1}}>{g.date}</div>
                  </div>
                ))}
              </div>
              {isSel&&<div style={{fontFamily:'monospace',fontSize:10,color:'#4a9eff',marginTop:8,textAlign:'center'}}>✓ Selected</div>}
            </div>
          );
        })}
      </div>
      <div style={S.card}><div style={S.cardTitle}>🎯 Draft Mode</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          {[['position','By Position','Alternate picks, opponent auto-gets matching position'],['free','No Limits','Snake draft — pick any available player']].map(([m,t,d])=>(<div key={m} onClick={()=>setDraftMode(m)} style={{padding:12,border:`2px solid ${draftMode===m?'#f5c842':'#2a3540'}`,borderRadius:8,cursor:'pointer',background:draftMode===m?'rgba(245,200,66,.06)':'#1c2630'}}>
            <div style={{...S.display,fontSize:14,letterSpacing:1,color:draftMode===m?'#f5c842':'#e8edf2',marginBottom:4}}>{t}</div>
            <div style={{fontSize:11,color:'#6b7a8d',lineHeight:1.4}}>{d}</div>
          </div>))}
        </div>
      </div>
      <ScoringEditor scoring={scoring} setScoring={setScoring}/>
      <button style={{...S.btnGold,width:'100%'}} disabled={!selectedSeries} onClick={()=>setStep(2)}>Begin Series →</button>
    </>)}
    {/* ── STEP 2: Coin flip — identical to ChallengeScreen ── */}
    {step===2&&(<div style={S.card}>
      <CoinFlip title="🪙 Coin Flip" subtitle="Winner picks first in Game 1" mode="random" callerName={me.name}
        winnerLabel={(_cw,result)=>`${result==='heads'?me.name:(opp?.name||'Opponent')} picks first in Game 1!`}
        ctaLabel={opp?.id==='bot_demo'?'⚡ Launch Series Draft →':'Send Series Challenge →'}
        onComplete={async(_cw,result)=>{
          const winner=result==='heads'?'challenger':'opponent';
          const s=await sendSeries(winner);
          setPendingSeries(s);
          setStep(3);
        }}/>
    </div>)}
    {/* ── STEP 3: Share — mirrors ChallengeScreen share step ── */}
    {step===3&&pendingSeries&&(()=>{
      const ds=selectedSeries;
      return(<>
        <div style={{textAlign:'center',padding:'18px 0 10px'}}>
          <div style={{fontSize:44,marginBottom:8}}>🔁</div>
          <div style={{...S.display,fontSize:26,color:'#4a9eff',letterSpacing:2,marginBottom:6}}>SERIES CHALLENGE SENT!</div>
          <div style={{fontSize:13,color:'#8a9bb0'}}>Now let {opp?.name} know they've been challenged.</div>
        </div>
        <div style={{padding:'10px 14px',background:'#1c2630',border:'1px solid rgba(74,158,255,.25)',borderRadius:8,marginBottom:14}}>
          <div style={{fontSize:14,fontWeight:700,color:'#4a9eff',marginBottom:2}}>{ds?.awayFull} vs {ds?.homeFull}</div>
          <div style={{display:'flex',gap:5,margin:'8px 0'}}>
            {(ds?.games||[]).map((g,i)=>(
              <div key={i} style={{flex:1,background:'#141b22',borderRadius:5,padding:'5px 3px',textAlign:'center',border:'1px solid rgba(74,158,255,.15)'}}>
                <div style={{fontFamily:'monospace',fontSize:8,color:'#6b7a8d'}}>{g.dayLabel}</div>
                <div style={{fontFamily:'monospace',fontSize:9,color:'#e8edf2',fontWeight:700}}>G{i+1}</div>
                <div style={{fontFamily:'monospace',fontSize:8,color:'#6b7a8d'}}>{g.date}</div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            <div style={{fontFamily:'monospace',fontSize:9,padding:'2px 8px',borderRadius:4,background:'rgba(74,158,255,.12)',color:'#4a9eff'}}>{numGames} Games · First to {Math.ceil(numGames/2)}</div>
            <div style={{fontFamily:'monospace',fontSize:9,padding:'2px 8px',borderRadius:4,background:'rgba(61,214,140,.12)',color:'#3dd68c'}}>PENDING</div>
            <div style={{fontFamily:'monospace',fontSize:9,padding:'2px 8px',borderRadius:4,background:'#1c2630',color:'#6b7a8d'}}>{draftMode==='position'?'By Position':'No Limits'}</div>
          </div>
        </div>
        <div style={S.card}>
          <div style={{...S.cardTitle,marginBottom:4}}>📲 Share Your Challenge</div>
          <div style={{fontSize:12,color:'#6b7a8d',marginBottom:14,lineHeight:1.5}}>
            Have {opp?.name} scan this QR code or send them a text to accept the series.
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:14}}>
            <div style={{padding:12,background:'#fff',borderRadius:12,boxShadow:'0 0 24px rgba(74,158,255,.2)'}}>
              <QRCode value={`diamond-duel:series:${me.joinCode}:${me.name}:${pendingSeries.id}`} size={160}/>
            </div>
            <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',marginTop:10,letterSpacing:1}}>SCAN TO JOIN DIAMOND DUEL</div>
            <div style={{fontFamily:'monospace',fontSize:11,color:'#4a9eff',fontWeight:700,marginTop:4,letterSpacing:2}}>Code: {me.joinCode}</div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            <button onClick={shareInvite} style={{...S.btnGold,display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'12px 0'}}><span style={{fontSize:17}}>💬</span><span style={{fontSize:13,fontWeight:700}}>Text Invite</span></button>
            <button onClick={copyInvite} style={{...S.btnOutline,display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'12px 0'}}><span style={{fontSize:17}}>{copied?'✅':'📋'}</span><span style={{fontSize:12,fontFamily:'monospace'}}>{copied?'Copied!':'Copy'}</span></button>
          </div>
        </div>
        <button style={{...S.btnOutline,width:'100%',marginTop:4}} onClick={()=>onNav('home')}>← Back to Home</button>
      </>);
    })()}
  </div></div>);
}
function SeriesScreen({series,me,friends,onNav,onOpenDuel,refresh,showToast,games,setActiveDuel}){
  const G=games||GAMES;
  const myRole=series.challengerId===me.id?'challenger':'opponent';
  const oppRole=myRole==='challenger'?'opponent':'challenger';
  const myName=myRole==='challenger'?series.challengerName:series.opponentName;
  const oppName=myRole==='challenger'?series.opponentName:series.challengerName;
  const myWins=myRole==='challenger'?series.challengerWins:series.opponentWins;
  const oppWins=myRole==='challenger'?series.opponentWins:series.challengerWins;
  const toWin=Math.ceil(series.numGames/2);
  const seriesDone=myWins>=toWin||oppWins>=toWin;
  const iWonSeries=myWins>=toWin;
  const seriesQuip=(gameNum,iWon,mW,oW,numGames)=>{
    const remaining=numGames-(mW+oW);
    const myNeed=toWin-mW, oppNeed=toWin-oW;
    const nextGame=`Game ${gameNum+1}`;
    if(seriesDone){
      return iWonSeries
        ?[`You did it. ${series.awayFull} vs ${series.homeFull} — series closed out.`,'Time to remind them what the final score was.',`${myWins}–${oppWins}. Don't let them forget it.`][Math.floor(Math.random()*3)]
        :[`That's the series. Tough one.`,'Head back to the leaderboard and reset.',`${myWins}–${oppWins}. Shake it off.`][Math.floor(Math.random()*3)];
    }
    if(iWon){
      if(myNeed===1) return `One win away from taking the series. Come back ${nextGame} and close it out.`;
      if(remaining===1) return `Win ${nextGame} and it's over. Don't let up now.`;
      return [`Good win. Come back for ${nextGame} and keep the pressure on.`,`Series lead is yours. Back it up ${nextGame}.`,`Nice. ${myNeed} more to win the series — ${nextGame} is everything.`][Math.floor(Math.random()*3)];
    } else {
      if(oppNeed===1) return `They're one away from taking it. You need ${nextGame} — no excuses.`;
      if(myNeed>oppNeed) return `They've got the edge now. ${nextGame} is must-win. Come back ready.`;
      return [`Tough loss. Shake it off and come back for ${nextGame}.`,`${nextGame} is your chance to even it up. Don't sleep on it.`,`Series is still alive — ${nextGame} matters more now.`][Math.floor(Math.random()*3)];
    }
  };
  const lastDoneIdx=[...series.games].reverse().findIndex(g=>g.status==='complete');
  const lastDone=lastDoneIdx>=0?series.games[series.games.length-1-lastDoneIdx]:null;
  const acceptSeries=async()=>{
    const updated={...series,status:'active'};
    await sset(`series:${series.id}`,updated);
    const inbox=(await sget(`series_inbox:${me.id}`))||[];
    await sset(`series_inbox:${me.id}`,inbox.map(s=>s.id===series.id?{...s,status:'active'}:s));
    const sent=(await sget(`series_sent:${series.challengerId}`))||[];
    await sset(`series_sent:${series.challengerId}`,sent.map(s=>s.id===series.id?{...s,status:'active',opponentName:me.name}:s));
    refresh(); showToast('Series accepted! Watch for lineups to drop.');
  };
  const launchGame=async(gameEntry,gameIdx)=>{
    const g=gameEntry.gameData||G.find(x=>x.id===gameEntry.gameId);
    if(!g){showToast('Game data not found');return;}
    const r1slots=buildSlotsForRound(g,1);
    const fpPattern=['challenger','opponent','challenger','opponent','challenger','opponent','challenger'];
    const fp=fpPattern[gameIdx]===series.coinWinner?series.coinWinner:(series.coinWinner==='challenger'?'opponent':'challenger');
    const r1order=buildOrder(fp,r1slots,series.draftMode);
    const duelId='duel_'+Math.random().toString(36).slice(2,12);
    const duel={
      id:duelId,challengerId:series.challengerId,opponentId:series.opponentId,
      challengerName:series.challengerName,opponentName:series.opponentName,
      gameId:g.id||gameEntry.gameId,draftMode:series.draftMode,scoring:series.scoring,
      slots:r1slots,order:r1order,pickIdx:0,assignments:{},takenIds:[],
      picks:{challenger:[],opponent:[]},pickLog:[],status:'drafting',
      draftRound:1,firstPick:fp,r2firstPick:null,
      seriesId:series.id,gameNum:gameEntry.gameNum,
    };
    await sset(`duel:${duelId}`,duel);
    const updatedGames=series.games.map((ge,i)=>i===gameIdx?{...ge,duelId,status:'drafting'}:ge);
    const updatedSeries={...series,games:updatedGames,status:'active'};
    await sset(`series:${series.id}`,updatedSeries);
    setActiveDuel(duel);
    onNav('duel');
  };
  const gameStatusColor=(g)=>{
    if(g.status==='complete') return g.winner===myRole?'#3dd68c':'#e84545';
    if(g.status==='drafting') return '#f5c842';
    if(g.status==='active') return '#f5c842';
    if(g.status==='lineup_ready') return '#4a9eff';
    return '#3a4a5a';
  };
  const nextActionIdx=series.games.findIndex(g=>g.status!=='complete');
  return(<div style={S.page}><div style={S.wrap}>
    <div style={S.header}>
      <button style={S.backBtn} onClick={()=>onNav('home')}>← Home</button>
      <div style={{...S.display,fontSize:18,color:'#4a9eff',letterSpacing:1.5}}>SERIES</div>
      <div style={{width:60}}/>
    </div>
    {/* Matchup banner */}
    <div style={{background:'linear-gradient(135deg,#141b22,#1a2535)',border:'1px solid rgba(74,158,255,.3)',borderRadius:12,padding:'14px 16px',marginBottom:12}}>
      <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:8}}>
        <div style={{fontFamily:'monospace',fontSize:9,color:'#4a9eff',letterSpacing:1.5,textTransform:'uppercase'}}>
          {series.numGames}-Game Series · First to {toWin}
        </div>
      </div>
      <div style={{fontSize:16,fontWeight:700,color:'#e8edf2',marginBottom:2}}>{series.awayFull||series.seriesLabel}</div>
      <div style={{fontSize:14,color:'#6b7a8d',marginBottom:12}}>vs {series.homeFull}</div>
      {/* Scoreboard */}
      {seriesDone&&(
        <div style={{textAlign:'center',marginBottom:10,padding:'8px',background:iWonSeries?'rgba(61,214,140,.08)':'rgba(232,69,69,.06)',borderRadius:8,border:`1px solid ${iWonSeries?'rgba(61,214,140,.25)':'rgba(232,69,69,.2)'}`}}>
          <div style={{...S.display,fontSize:16,color:iWonSeries?'#3dd68c':'#e84545',letterSpacing:2}}>{iWonSeries?'🏆 YOU WIN THE SERIES!':'😬 SERIES OVER'}</div>
        </div>
      )}
      <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:8,alignItems:'center',textAlign:'center',marginBottom:12}}>
        <div>
          <div style={{fontFamily:'monospace',fontSize:9,color:'#4a9eff',letterSpacing:.5,marginBottom:3}}>{myName.split(' ')[0].toUpperCase()}</div>
          <div style={{...S.display,fontSize:48,color:'#4a9eff',lineHeight:1}}>{myWins}</div>
        </div>
        <div style={{fontFamily:'monospace',fontSize:14,color:'#3a4a5a'}}>–</div>
        <div>
          <div style={{fontFamily:'monospace',fontSize:9,color:'#e84545',letterSpacing:.5,marginBottom:3}}>{oppName.split(' ')[0].toUpperCase()}</div>
          <div style={{...S.display,fontSize:48,color:'#e84545',lineHeight:1}}>{oppWins}</div>
        </div>
      </div>
      {/* Game dots */}
      <div style={{display:'flex',justifyContent:'center',gap:5}}>
        {series.games.map((g,i)=>{
          const dot=g.status==='complete'?(g.winner===myRole?'mine':g.winner===oppRole?'opp':'tie'):g.status==='drafting'?'active':'pending';
          return(
            <div key={i} style={{width:32,height:32,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,
              background:dot==='mine'?'#4a9eff':dot==='opp'?'#e84545':dot==='tie'?'#6b7a8d':dot==='active'?'rgba(245,200,66,.2)':'#1c2630',
              border:`2px solid ${dot==='mine'?'#4a9eff':dot==='opp'?'#e84545':dot==='tie'?'#6b7a8d':dot==='active'?'#f5c842':'#2a3540'}`,
              color:dot==='pending'?'#3a4a5a':'#fff',fontFamily:'monospace',fontWeight:700,
            }}>{dot==='mine'?'W':dot==='opp'?'L':dot==='tie'?'T':dot==='active'?'●':i+1}</div>
          );
        })}
      </div>
    </div>
    {/* Accept banner */}
    {series.status==='pending'&&myRole==='opponent'&&(
      <div style={{...S.card,background:'rgba(74,158,255,.06)',border:'1px solid rgba(74,158,255,.25)',marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:600,color:'#4a9eff',marginBottom:4}}>⚔️ {series.challengerName} challenged you!</div>
        <div style={{fontSize:12,color:'#8a9bb0',marginBottom:4}}>{series.awayFull} vs {series.homeFull}</div>
        <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',marginBottom:12}}>{series.numGames} games · First to {toWin} · Redraft each game · {series.draftMode==='position'?'By Position':'No Limits'}</div>
        <button style={{...S.btnGold,width:'100%'}} onClick={acceptSeries}>Accept Series →</button>
      </div>
    )}
    {/* Post-game context message */}
    {lastDone&&!seriesDone&&(
      <div style={{...S.card,background:'rgba(74,158,255,.04)',border:'1px solid rgba(74,158,255,.15)',marginBottom:12}}>
        <div style={{fontSize:13,color:'#8a9bb0',lineHeight:1.6,fontStyle:'italic'}}>
          "{seriesQuip(lastDone.gameNum,lastDone.winner===myRole,myWins,oppWins,series.numGames)}"
        </div>
        {nextActionIdx>=0&&<div style={{fontFamily:'monospace',fontSize:10,color:'#4a9eff',marginTop:8}}>
          Next up: Game {nextActionIdx+1} · {series.games[nextActionIdx]?.date||'TBD'}
        </div>}
      </div>
    )}
    {seriesDone&&(
      <div style={{...S.card,background:iWonSeries?'rgba(61,214,140,.04)':'rgba(232,69,69,.04)',border:`1px solid ${iWonSeries?'rgba(61,214,140,.15)':'rgba(232,69,69,.15)'}`,marginBottom:12}}>
        <div style={{fontSize:13,color:'#8a9bb0',lineHeight:1.6,fontStyle:'italic'}}>
          "{seriesQuip(series.numGames,iWonSeries,myWins,oppWins,series.numGames)}"
        </div>
      </div>
    )}
    {/* Game-by-game list */}
    <div style={S.card}>
      <div style={S.cardTitle}>🗓️ Schedule</div>
      {series.games.map((g,i)=>{
        const gameData=g.gameData;
        const isNext=i===nextActionIdx&&series.status==='active';
        const canDraft=series.status==='active'&&!g.duelId&&g.status!=='complete';
        const hasResume=g.duelId&&(g.status==='drafting'||g.status==='active');
        const sc=gameStatusColor(g);
        return(
          <div key={i} style={{padding:'12px 0',borderBottom:i<series.games.length-1?'1px solid rgba(42,53,64,.4)':'none',background:isNext?'rgba(74,158,255,.03)':'none'}}>
            {/* Row header */}
            <div style={{display:'flex',alignItems:'flex-start',gap:10}}>
              {/* Game number circle */}
              <div style={{width:32,height:32,borderRadius:'50%',background:sc+'22',border:`2px solid ${sc}55`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1}}>
                <div style={{fontFamily:'monospace',fontSize:10,fontWeight:700,color:sc}}>G{i+1}</div>
              </div>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:2}}>
                  <div style={{fontSize:13,fontWeight:700,color:'#e8edf2'}}>
                    {g.dayLabel} {g.date}
                  </div>
                  {/* Status badge */}
                  <div style={{fontFamily:'monospace',fontSize:9,padding:'2px 7px',borderRadius:3,
                    background:g.status==='complete'?(g.winner===myRole?'rgba(61,214,140,.12)':'rgba(232,69,69,.12)'):'rgba(74,158,255,.1)',
                    color:g.status==='complete'?(g.winner===myRole?'#3dd68c':'#e84545'):'#4a9eff',
                  }}>{g.status==='complete'?(g.winner===myRole?'WIN':'LOSS'):g.status==='drafting'?'DRAFTING':isNext?'UP NEXT':'TBD'}</div>
                </div>
                {/* Matchup */}
                <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',marginBottom:gameData?4:0}}>
                  {gameData?`${gameData.awayFull} @ ${gameData.homeFull}`:series.awayFull+' @ '+series.homeFull}
                </div>
                {/* Pitching matchup */}
                {gameData&&(
                  <div style={{fontFamily:'monospace',fontSize:9,color:'#3a4a5a',marginBottom:4}}>
                    {gameData.awaySP.name} vs {gameData.homeSP.name}
                  </div>
                )}
                {/* Score if complete */}
                {g.status==='complete'&&g.challengerScore!=null&&(
                  <div style={{fontFamily:'monospace',fontSize:11,color:g.winner===myRole?'#3dd68c':'#e84545',fontWeight:700}}>
                    {myRole==='challenger'?g.challengerScore:g.opponentScore} – {myRole==='challenger'?g.opponentScore:g.challengerScore} pts
                  </div>
                )}
              </div>
            </div>
            {/* CTA */}
            {(canDraft||hasResume)&&(
              <div style={{marginTop:10,marginLeft:42}}>
                {hasResume&&<button style={{...S.btnGold,fontSize:12,padding:'8px 16px',marginRight:8}} onClick={()=>onOpenDuel(g.duelId)}>Resume Draft →</button>}
                {canDraft&&!hasResume&&(
                  <button style={{...S.btnGold,fontSize:12,padding:'8px 16px',width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:6}} onClick={()=>launchGame(g,i)}>
                    <span>📋</span><span>Draft Game {i+1}</span>
                  </button>
                )}
              </div>
            )}
            {g.status==='awaiting_lineup'&&i>0&&series.games[i-1]?.status!=='complete'&&(
              <div style={{marginTop:6,marginLeft:42,fontFamily:'monospace',fontSize:9,color:'#3a4a5a'}}>Available after Game {i} completes</div>
            )}
          </div>
        );
      })}
    </div>
    {/* Footer info */}
    <div style={{display:'flex',gap:8,marginBottom:10}}>
      {[['Draft','Each game'],['Mode',series.draftMode==='position'?'By Position':'No Limits'],['Status',seriesDone?'DONE':series.status.toUpperCase()]].map(([l,v])=>(
        <div key={l} style={{flex:1,background:'#141b22',border:'1px solid #2a3540',borderRadius:8,padding:'8px 6px',textAlign:'center'}}>
          <div style={{fontFamily:'monospace',fontSize:8,color:'#6b7a8d',letterSpacing:.5,textTransform:'uppercase'}}>{l}</div>
          <div style={{fontFamily:'monospace',fontSize:10,color:'#e8edf2',marginTop:2,fontWeight:600}}>{v}</div>
        </div>
      ))}
    </div>
  </div></div>);
}
function ChallengeScreen({me,friends,onNav,refresh,showToast,setActiveDuel,isDemo,onLaunchDemo,games,gamesLoading,onDemo}){
  const G=games||GAMES;
  const bot=friends.find(f=>f.id==='bot_demo');
  const [step,setStep]=useState(isDemo?1:0);
  const [inviteMode,setInviteMode]=useState('friends');
  const [opp,setOpp]=useState(isDemo&&bot?bot:null);
  const [gameId,setGameId]=useState(null);
  const [draftMode,setDraftMode]=useState('position');
  const [scoring,setScoring]=useState({...DSC});
  const [pendingChallenge,setPendingChallenge]=useState(null);
  const [copied,setCopied]=useState(false);
  const realFriends=friends.filter(f=>f.id!=='bot_demo');
  const sendWithWinner=async(winner)=>{
    if(!opp||!gameId)return;
    const selectedGame=G.find(x=>x.id===gameId);
    const lineupReady=hasLineups(selectedGame);
    const duelId='duel_'+Math.random().toString(36).slice(2,12);
    const ch={duelId,challengerId:me.id,challengerName:me.name,opponentId:opp.id,opponentName:opp.name,gameId,draftMode,scoring,coinWinner:winner,status:lineupReady?'pending':'lineup_pending',lineupReady,createdAt:Date.now()};
    const inbox=(await sget(`challenges:${opp.id}`))||[]; inbox.push(ch); await sset(`challenges:${opp.id}`,inbox);
    const sent=(await sget(`challenges_sent:${me.id}`))||[]; sent.push({...ch,dir:'out'}); await sset(`challenges_sent:${me.id}`,sent);
    if(!lineupReady){
      const watch=(await sget('lineup_watch'))||[];
      watch.push({duelId,gameId,challengerId:me.id,opponentId:opp.id});
      await sset('lineup_watch',watch);
    }
    refresh();
    return ch;
  };
  const handleCoinDone=async(winner)=>{
    if(isDemo){onLaunchDemo(gameId,draftMode,scoring,winner);return;}
    const ch=await sendWithWinner(winner);
    setPendingChallenge(ch);
    setStep(3);
  };
  const inviteText=()=>{
    const g=G.find(x=>x.id===gameId);
    return `⚾ ${me.name} challenged you to a Diamond Duel!\n\nGame: ${g?`${g.awayFull} @ ${g.homeFull}`:'tonight\'s game'}\n\nOpen Diamond Duel and enter join code: ${me.joinCode}\nThen accept the challenge from ${me.name}.`;
  };
  const shareInvite=async()=>{
    const text=inviteText();
    if(navigator.share){
      try{await navigator.share({title:'Diamond Duel Challenge',text});}
      catch{}
    } else {
      await navigator.clipboard.writeText(text).catch(()=>{});
      setCopied(true); setTimeout(()=>setCopied(false),2500);
    }
  };
  const copyInvite=async()=>{
    await navigator.clipboard.writeText(inviteText()).catch(()=>{});
    setCopied(true); setTimeout(()=>setCopied(false),2500);
  };
  const backStep=()=>{
    if(step===3){onNav('home');return;}
    if(step===0)onNav('home');
    else if(step===1&&isDemo)onNav('home');
    else setStep(s=>s-1);
  };
  return(<div style={S.page}><div style={S.wrap}>
    <div style={S.header}>
      <button style={S.backBtn} onClick={backStep}>← {step===3?'Home':'Back'}</button>
      <div style={{...S.display,fontSize:22,color:'#f5c842',letterSpacing:2}}>{isDemo?'DEMO DUEL':'NEW DUEL'}</div>
      <div style={{width:60}}/>
    </div>
    {isDemo&&(<div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:'rgba(192,132,252,.08)',border:'1px solid rgba(192,132,252,.25)',borderRadius:8,marginBottom:12}}>
      <div style={{fontSize:24}}>🤖</div><div><div style={{fontSize:13,fontWeight:600,color:'#c084fc'}}>vs Demo Bot</div><div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',marginTop:1}}>Set up your game, then launch the draft</div></div>
    </div>)}
    {/* ── STEP 0: Choose opponent ── */}
    {step===0&&!isDemo&&(<>
      {/* Toggle: existing friends vs invite new */}
      <div style={{display:'flex',gap:0,marginBottom:14,background:'#1c2630',border:'1px solid #2a3540',borderRadius:8,overflow:'hidden'}}>
        {[['friends','👥 Friends'],['new','✉️ Invite New']].map(([v,label])=>(
          <button key={v} onClick={()=>setInviteMode(v)} style={{flex:1,padding:'10px 0',background:inviteMode===v?'rgba(245,200,66,.1)':'none',border:'none',borderRight:v==='friends'?'1px solid #2a3540':'none',color:inviteMode===v?'#f5c842':'#6b7a8d',fontFamily:'monospace',fontSize:12,letterSpacing:.5,cursor:'pointer',fontWeight:inviteMode===v?700:400}}>{label}</button>
        ))}
      </div>
      {inviteMode==='friends'&&(<div style={S.card}>
        <div style={S.cardTitle}>⚔️ Who are you challenging?</div>
        {realFriends.length===0
          ?(<div style={{textAlign:'center',padding:'12px 0'}}>
              <div style={{fontSize:13,color:'#6b7a8d',marginBottom:12}}>No friends added yet.</div>
              <button onClick={()=>setInviteMode('new')} style={{...S.btnGold,padding:'8px 20px'}}>Invite Someone →</button>
            </div>)
          :realFriends.map(f=>(<div key={f.id} onClick={()=>setOpp(f)} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',border:`2px solid ${opp?.id===f.id?f.color:'#2a3540'}`,borderRadius:8,marginBottom:8,cursor:'pointer',background:opp?.id===f.id?f.color+'11':'#1c2630'}}>
              <div style={{fontSize:26}}>{f.avatar}</div>
              <div style={{flex:1}}><div style={{fontWeight:600,color:f.color}}>{f.name}</div><div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d'}}>{f.wins||0}W · {f.losses||0}L</div></div>
              {opp?.id===f.id&&<div style={{color:f.color,fontWeight:700}}>✓</div>}
            </div>))}
        {opp&&<button style={{...S.btnGold,width:'100%',marginTop:4}} onClick={()=>setStep(1)}>Next →</button>}
      </div>)}
      {inviteMode==='new'&&(<div style={S.card}>
        <div style={S.cardTitle}>📲 Invite a Friend</div>
        <div style={{fontSize:13,color:'#8a9bb0',lineHeight:1.6,marginBottom:14}}>
          Share your join code so they can add you as a friend, then come back to challenge them.
        </div>
        {/* Join code display */}
        <div style={{textAlign:'center',padding:'14px',background:'rgba(245,200,66,.06)',border:'1px solid rgba(245,200,66,.2)',borderRadius:10,marginBottom:14}}>
          <div style={{fontFamily:'monospace',fontSize:11,color:'#6b7a8d',letterSpacing:1,marginBottom:6}}>YOUR JOIN CODE</div>
          <div style={{fontFamily:"'Bebas Neue',Arial,serif",fontSize:44,color:'#f5c842',letterSpacing:8}}>{me.joinCode}</div>
        </div>
        {/* QR Code */}
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:14}}>
          <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',letterSpacing:1,marginBottom:8,textTransform:'uppercase'}}>Scan to get my code</div>
          <div style={{padding:10,background:'#fff',borderRadius:10,boxShadow:'0 0 20px rgba(245,200,66,.15)'}}>
            <QRCode value={`diamond-duel:join:${me.joinCode}:${me.name}`} size={150}/>
          </div>
          <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',marginTop:8}}>Point camera at code to add me</div>
        </div>
        {/* Share buttons */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          <button onClick={shareInvite} style={{...S.btnGold,display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'11px 0'}}>
            <span style={{fontSize:16}}>💬</span><span style={{fontSize:13}}>Send Text</span>
          </button>
          <button onClick={copyInvite} style={{...S.btnOutline,display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'11px 0'}}>
            <span style={{fontSize:16}}>{copied?'✅':'📋'}</span><span style={{fontSize:12,fontFamily:'monospace'}}>{copied?'Copied!':'Copy Invite'}</span>
          </button>
        </div>
      </div>)}
      {/* ── Demo Bot alternative ── */}
      <div style={{display:'flex',alignItems:'center',gap:10,marginTop:6}}>
        <div style={{flex:1,height:'1px',background:'#2a3540'}}/>
        <span style={{fontFamily:'monospace',fontSize:10,color:'#3a4a5a',letterSpacing:1}}>OR</span>
        <div style={{flex:1,height:'1px',background:'#2a3540'}}/>
      </div>
      <button onClick={onDemo} style={{width:'100%',marginTop:10,display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:'rgba(192,132,252,.06)',border:'1px solid rgba(192,132,252,.25)',borderRadius:10,cursor:'pointer'}}>
        <span style={{fontSize:24}}>🤖</span>
        <div style={{textAlign:'left',flex:1}}>
          <div style={{...S.display,fontSize:13,letterSpacing:1,color:'#c084fc'}}>DEMO DUEL VS BOT</div>
          <div style={{fontSize:11,color:'#6b7a8d',marginTop:2}}>Test the full flow solo</div>
        </div>
        <span style={{color:'#c084fc',fontFamily:'monospace',fontSize:13}}>→</span>
      </button>
    </>)}
    {/* ── STEP 1: Game + settings ── */}
    {step===1&&(<>
      <div style={S.card}><div style={S.cardTitle}>🗓️ Select Game</div>
        {gamesLoading
          ?<div style={{textAlign:'center',padding:'20px 0',color:'#6b7a8d',fontFamily:'monospace',fontSize:12}}>⏳ Loading today's games…</div>
          :G.map(g=>{
            const lineupReady=hasLineups(g);
            const isSelected=gameId===g.id;
            return(
              <div key={g.id} onClick={()=>setGameId(g.id)} style={{padding:'14px',border:`2px solid ${isSelected?'#f5c842':'#2a3540'}`,borderRadius:12,cursor:'pointer',background:isSelected?'rgba(245,200,66,.05)':'#141b22',marginBottom:10,transition:'all .15s'}}>
                {/* Teams */}
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:8}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:700,color:isSelected?'#f5c842':'#e8edf2'}}>{g.awayFull}</div>
                    <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',margin:'2px 0 6px'}}>@ {g.homeFull}</div>
                    {/* Pitching matchup */}
                    {g.awaySP&&g.homeSP&&<div style={{fontFamily:'monospace',fontSize:9,color:'#3a4a5a'}}>
                      {g.awaySP.name} vs {g.homeSP.name}
                    </div>}
                  </div>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4,flexShrink:0,marginLeft:10}}>
                    <div style={{fontFamily:'monospace',fontSize:10,padding:'3px 8px',borderRadius:4,background:g.status==='live'?'rgba(61,214,140,.15)':'rgba(245,200,66,.08)',color:g.status==='live'?'#3dd68c':'#f5c842',fontWeight:700}}>{g.status==='live'?'● LIVE':g.time}</div>
                    <div style={{fontFamily:'monospace',fontSize:9,padding:'2px 6px',borderRadius:3,background:lineupReady?'rgba(61,214,140,.1)':'rgba(42,53,64,.3)',color:lineupReady?'#3dd68c':'#6b7a8d'}}>{lineupReady?'✓ Lineup set':'⏳ TBD'}</div>
                  </div>
                </div>
                {!lineupReady&&<div style={{fontFamily:'monospace',fontSize:9,color:'#6b7a8d',borderTop:'1px solid rgba(42,53,64,.3)',paddingTop:7,marginTop:4}}>
                  💡 You can still lock this in — we'll notify you both when lineups drop
                </div>}
                {isSelected&&<div style={{fontFamily:'monospace',fontSize:10,color:'#f5c842',marginTop:6,textAlign:'center'}}>✓ Selected</div>}
              </div>
            );
          })}
      </div>
      <div style={S.card}><div style={S.cardTitle}>🎯 Draft Mode</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          {[['position','By Position','Alternate picks, opponent auto-gets matching position'],['free','No Limits','Snake draft — pick any available player']].map(([m,t,d])=>(<div key={m} onClick={()=>setDraftMode(m)} style={{padding:12,border:`2px solid ${draftMode===m?'#f5c842':'#2a3540'}`,borderRadius:8,cursor:'pointer',background:draftMode===m?'rgba(245,200,66,.06)':'#1c2630'}}>
            <div style={{...S.display,fontSize:14,letterSpacing:1,color:draftMode===m?'#f5c842':'#e8edf2',marginBottom:4}}>{t}</div>
            <div style={{fontSize:11,color:'#6b7a8d',lineHeight:1.4}}>{d}</div>
          </div>))}
        </div>
      </div>
      <ScoringEditor scoring={scoring} setScoring={setScoring}/>
      <button style={{...S.btnGold,width:'100%'}} disabled={!gameId} onClick={()=>setStep(2)}>Begin Draft →</button>
    </>)}
    {/* ── STEP 2: Coin flip ── */}
    {step===2&&(<div style={S.card}>
      <CoinFlip title="🪙 Coin Flip" subtitle="Winner picks first in the pitcher draft" mode="random" callerName={me.name}
        winnerLabel={(_cw,result)=>`${result==='heads'?me.name:(opp?.name||'Opponent')} picks first!`}
        ctaLabel={isDemo?'⚡ Launch Demo Draft':'Send Challenge →'}
        onComplete={(_cw,result)=>{
          const winner=result==='heads'?'challenger':'opponent';
          handleCoinDone(winner);
        }}/>
    </div>)}
    {/* ── STEP 3: Share the challenge ── */}
    {step===3&&pendingChallenge&&(()=>{
      const g=G.find(x=>x.id===gameId);
      return(<>
        <div style={{textAlign:'center',padding:'18px 0 10px'}}>
          <div style={{fontSize:44,marginBottom:8}}>⚔️</div>
          <div style={{...S.display,fontSize:26,color:'#f5c842',letterSpacing:2,marginBottom:6}}>CHALLENGE SENT!</div>
          <div style={{fontSize:13,color:'#8a9bb0'}}>Now let {opp?.name} know they've been challenged.</div>
        </div>
        {/* Game summary pill */}
        <div style={{padding:'10px 14px',background:'#1c2630',border:'1px solid #2a3540',borderRadius:8,marginBottom:14,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{fontSize:13,fontWeight:600}}>{g?.awayFull} @ {g?.homeFull}</div>
            <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',marginTop:2}}>{draftMode==='position'?'By Position':'No Limits'} · {g?.time}</div>
          </div>
          <div style={{fontFamily:'monospace',fontSize:11,padding:'3px 8px',borderRadius:4,background:'rgba(61,214,140,.12)',color:'#3dd68c'}}>PENDING</div>
        </div>
        {/* QR Code */}
        <div style={S.card}>
          <div style={{...S.cardTitle,marginBottom:4}}>📲 Share Your Challenge</div>
          <div style={{fontSize:12,color:'#6b7a8d',marginBottom:14,lineHeight:1.5}}>
            Have {opp?.name} scan this QR code or send them a text — they'll need to open Diamond Duel, enter your join code, and accept the challenge.
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:14}}>
            <div style={{padding:12,background:'#fff',borderRadius:12,boxShadow:'0 0 24px rgba(245,200,66,.2)'}}>
              <QRCode value={`diamond-duel:challenge:${me.joinCode}:${me.name}:${pendingChallenge.duelId}`} size={160}/>
            </div>
            <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',marginTop:10,letterSpacing:1}}>SCAN TO JOIN DIAMOND DUEL</div>
            <div style={{fontFamily:'monospace',fontSize:11,color:'#f5c842',fontWeight:700,marginTop:4,letterSpacing:2}}>Code: {me.joinCode}</div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            <button onClick={shareInvite} style={{...S.btnGold,display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'12px 0'}}>
              <span style={{fontSize:17}}>💬</span><span style={{fontSize:13,fontWeight:700}}>Text Invite</span>
            </button>
            <button onClick={copyInvite} style={{...S.btnOutline,display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'12px 0'}}>
              <span style={{fontSize:17}}>{copied?'✅':'📋'}</span><span style={{fontSize:12,fontFamily:'monospace'}}>{copied?'Copied!':'Copy'}</span>
            </button>
          </div>
        </div>
        <button style={{...S.btnOutline,width:'100%',marginTop:4}} onClick={()=>onNav('home')}>← Back to Home</button>
      </>);
    })()}
  </div></div>);
}
function MidDraftCoin({duel,myRole,onFlip}){
  const r1Winner=duel.firstPick;
  const callerRole=r1Winner==='challenger'?'opponent':'challenger';
  const callerName=callerRole==='challenger'?duel.challengerName:duel.opponentName;
  return(<CoinFlip title="🪙 Round 2 Coin Flip" subtitle="Pitchers locked in! Flip for position player draft order."
    mode="call" callerName={callerName}
    winnerLabel={(callerWon,_r)=>{const w=callerWon?callerName:(callerRole==='challenger'?duel.opponentName:duel.challengerName);return`${w} picks first!`;}}
    ctaLabel="Start Position Player Draft →"
    onComplete={(callerWon)=>{const winner=callerWon?callerRole:(callerRole==='challenger'?'opponent':'challenger');onFlip(winner);}}/>);
}
function FullRosterToggle({duel,chColor,opColor}){
  const [open,setOpen]=useState(false);
  if(!duel?.picks)return null;
  const StatLine=({p,color})=>{
    if(!p||!p.stats)return null; const s=p.stats; let line='';
    if(p.pos==='SP'||p.pos==='BULLPEN') line=`${s.ip}IP · ${s.k}K · ${s.er}ER${s.w?' · W':''}${s.sv?' · SV':''}`;
    else{const hits=[s.hr?`${s.hr}HR`:'',s.triple?`${s.triple}3B`:'',s.double?`${s.double}2B`:'',s.single?`${s.single}H`:''].filter(Boolean);line=`${hits.length?hits.join(' '):'0H'} · ${s.rbi}RBI · ${s.run}R`;}
    return(<div style={{display:'flex',alignItems:'center',gap:8,padding:'6px 0',borderBottom:'1px solid rgba(42,53,64,.35)'}}>
      <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',minWidth:44}}>{p.pos}</div>
      <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{p.name}</div><div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',marginTop:1}}>{line}</div></div>
      <div style={{fontFamily:'monospace',fontSize:12,fontWeight:700,color:(p.fpts||0)>=0?color:'#e84545'}}>{(p.fpts||0)>0?'+':''}{p.fpts||0}</div>
    </div>);
  };
  return(<div style={{background:'#141b22',border:'1px solid #2a3540',borderRadius:10,overflow:'hidden',marginBottom:12}}>
    <div onClick={()=>setOpen(o=>!o)} style={{padding:'10px 14px',background:'#1c2630',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <span style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',letterSpacing:1.5,textTransform:'uppercase'}}>Full Box Score</span>
      <span style={{color:'#6b7a8d',fontSize:12}}>{open?'▲':'▼'}</span>
    </div>
    {open&&(<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:0}}>
      {[['challenger',chColor,duel.challengerName],['opponent',opColor,duel.opponentName]].map(([role,color,name])=>(<div key={role} style={{padding:'8px 12px',borderRight:role==='challenger'?'1px solid #2a3540':'none'}}>
        <div style={{fontFamily:"'Bebas Neue',Arial,serif",fontSize:12,color,letterSpacing:1,marginBottom:6}}>{name}</div>
        {(duel.picks[role]||[]).map((p,i)=><StatLine key={i} p={p} color={color}/>)}
      </div>))}
    </div>)}
  </div>);
}
function H2HScreen({me,friends,onNav,showToast}){
  const [selId,setSelId]=useState(null);
  const [h2h,setH2h]=useState([]);
  const bot={id:'bot_demo',name:'Demo Bot 🤖',avatar:'🤖',color:'#c084fc'};
  const realFriends=friends.filter(f=>f.id!=='bot_demo');
  const allOpponents=[bot,...realFriends];
  useEffect(()=>{
    if(!selId)return;
    const k=[me.id,selId].sort().join('_');
    sget(`h2h:${k}`).then(d=>setH2h(d||[]));
  },[selId,me.id]);
  return(<div style={S.page}><div style={S.wrap}>
    <div style={S.header}><button style={S.backBtn} onClick={()=>onNav('home')}>← Back</button><div style={{...S.display,fontSize:22,color:'#f5c842',letterSpacing:2}}>HEAD 2 HEAD</div><div style={{width:60}}/></div>
    <div style={S.card}><div style={S.cardTitle}>Select Opponent</div>
      {allOpponents.map(f=>(
        <div key={f.id} onClick={()=>setSelId(f.id)} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',border:`2px solid ${selId===f.id?f.color:'#2a3540'}`,borderRadius:8,marginBottom:8,cursor:'pointer',background:selId===f.id?f.color+'11':'#1c2630'}}>
          <div style={{fontSize:26}}>{f.avatar}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:600,color:f.color}}>{f.name}</div>
            {f.id==='bot_demo'&&<div style={{fontFamily:'monospace',fontSize:9,color:'#6b7a8d',marginTop:1}}>Bot simulations</div>}
          </div>
          {selId===f.id&&<div style={{color:f.color}}>✓</div>}
        </div>
      ))}
    </div>
    {selId&&(<div style={S.card}><div style={S.cardTitle}>📊 Match History</div>
      {h2h.length===0
        ?<div style={S.empty}>{selId==='bot_demo'?'No bot duels yet. Run a demo to build history!':'No games yet vs this player'}</div>
        :h2h.map((g,i)=>{
          const w=g.winner==='tie'?'Tie':g.winner==='challenger'&&g.challengerId===me.id?'Win':g.winner==='opponent'&&g.opponentId===me.id?'Win':'Loss';
          const wc=w==='Win'?'#3dd68c':w==='Tie'?'#6b7a8d':'#e84545';
          return(<div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:'1px solid rgba(42,53,64,.5)'}}>
            <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',minWidth:50}}>{g.date}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:600}}>{g.challengerName} vs {g.opponentName}</div>
              <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',marginTop:1}}>{(g.finalScores?.challenger||0).toFixed(1)} – {(g.finalScores?.opponent||0).toFixed(1)}</div>
            </div>
            <div style={{fontFamily:'monospace',fontSize:11,padding:'2px 8px',borderRadius:4,background:w==='Win'?'rgba(61,214,140,.12)':w==='Tie'?'rgba(107,122,141,.15)':'rgba(232,69,69,.12)',color:wc}}>{w}</div>
          </div>);
        })}
    </div>)}
  </div></div>);
}
function CollapsedPlayByPlay({simEvents, roleColor}){
  const [open, setOpen] = useState(false);
  return(
    <div style={{background:'#141b22',border:'1px solid #2a3540',borderRadius:8,overflow:'hidden',marginBottom:10}}>
      <div onClick={()=>setOpen(o=>!o)} style={{padding:'9px 12px',background:'#1c2630',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontFamily:'monospace',fontSize:9,color:'#6b7a8d',letterSpacing:1.5,textTransform:'uppercase'}}>Play by Play</span>
        <span style={{color:'#6b7a8d',fontSize:12}}>{open?'▲':'▼'}</span>
      </div>
      {open&&(
        <div style={{maxHeight:240,overflowY:'auto'}}>
          {simEvents.length===0&&<div style={{padding:'16px',textAlign:'center',color:'#6b7a8d',fontSize:12}}>No events recorded</div>}
          {simEvents.map((ev,i)=>(
            <div key={i} style={{display:'flex',gap:8,alignItems:'flex-start',padding:'6px 12px',borderBottom:'1px solid rgba(42,53,64,.3)'}}>
              <div style={{fontFamily:'monospace',fontSize:9,color:'#6b7a8d',minWidth:22,paddingTop:1,flexShrink:0}}>I{ev.inn}</div>
              <div style={{fontSize:11,flex:1,lineHeight:1.4,color:'#c0cad6'}}>{ev.desc}</div>
              <div style={{fontFamily:'monospace',fontSize:10,padding:'1px 5px',borderRadius:3,whiteSpace:'nowrap',flexShrink:0,background:ev.pts>0?(ev.role==='challenger'?'rgba(74,158,255,.12)':'rgba(232,69,69,.12)'):'rgba(107,122,141,.1)',color:ev.pts>0?roleColor(ev.role):'#6b7a8d'}}>{ev.pts>0?'+':''}{ev.pts}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
function PlayerPhoto({p, size=28, borderColor}){
  const [err,setErr]=useState(false);
  const initials=(p?.pos||'?').slice(0,2);
  const bg=borderColor?borderColor+'22':'#2a3540';
  if(p?.mlbId&&!err){
    return(
      <div style={{width:size,height:size,borderRadius:'50%',overflow:'hidden',flexShrink:0,border:`1.5px solid ${borderColor||'#2a3540'}`,background:'#1c2630'}}>
        <img
          src={`https://img.mlb.com/headshots/current/60x60/${p.mlbId}.jpg`}
          alt={p.name}
          onError={()=>setErr(true)}
          style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}
        />
      </div>
    );
  }
  return(
    <div style={{width:size,height:size,borderRadius:'50%',flexShrink:0,border:`1.5px solid ${borderColor||'#2a3540'}`,background:bg,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <span style={{fontFamily:'monospace',fontSize:size*0.38,fontWeight:700,color:borderColor||'#6b7a8d',lineHeight:1}}>{initials}</span>
    </div>
  );
}
function LivePlayerRow({p, role, myRole, myColor, oppColor2}){
  if(!p) return null;
  const color = role===myRole ? myColor : oppColor2;
  const fpts = p.fpts!==undefined ? p.fpts : null;
  const s = p.stats; let line='';
  if(s){
    if(p.pos==='SP'||p.pos==='BULLPEN') line=`${s.ip}IP ${s.k}K ${s.er}ER`;
    else{ const hits=[s.hr?`${s.hr}HR`:'',s.double?`${s.double}2B`:'',s.single?`${s.single}H`:''].filter(Boolean); line=hits.length?hits.join(' '):`${s.rbi||0}RBI`; }
  }
  return(
    <div style={{display:'flex',alignItems:'center',padding:'5px 8px',borderBottom:'1px solid rgba(42,53,64,.3)',gap:6}}>
      <PlayerPhoto p={p} size={26} borderColor={color}/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:11,fontWeight:600,color:'#e8edf2',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{p.name}</div>
        <div style={{fontFamily:'monospace',fontSize:9,color:'#6b7a8d'}}>{p.pos}{line?' · '+line:''}</div>
      </div>
      <div style={{fontFamily:'monospace',fontSize:12,fontWeight:700,color:fpts!==null?(fpts>=0?color:'#6b7a8d'):'#3a4a5a',flexShrink:0}}>
        {fpts!==null?(fpts>0?'+':'')+fpts:'—'}
      </div>
    </div>
  );
}
function DuelScreen({duel,me,setActiveDuel,onNav,refresh,showToast,refreshMe,games}){
  const G=games||GAMES;
  const [draftView, setDraftView] = useState('board');
  const [r1justDone, setR1justDone] = useState(false);
  const [showRosterBeforeCoin, setShowRosterBeforeCoin] = useState(false);
  const [statFilter, setStatFilter] = useState('season');
  const [simEvents,setSimEvents]=useState([]);
  const [simScores,setSimScores]=useState({challenger:0,opponent:0});
  const [inningPts,setInningPts]=useState({challenger:Array(9).fill(null),opponent:Array(9).fill(null)});
  const [simDone,setSimDone]=useState(false);
  const [scoreHistory,setScoreHistory]=useState([]);
  const simTimer=useRef(null);
  const simRunning=useRef(false);
  const simStarted=useRef(false);
  const duelRef=useRef(duel);
  const pickingRef=useRef(false);
  useEffect(()=>{duelRef.current=duel;},[duel]);
  const myRole=duel?.challengerId===me?.id?'challenger':'opponent';
  const oppRole=myRole==='challenger'?'opponent':'challenger';
  const oppName=duel?(myRole==='challenger'?duel.opponentName:duel.challengerName):'';
  const game=duel?G.find(g=>g.id===duel.gameId):null;
  const sc=duel?.scoring||DSC;
  const isNoLimits=duel?.draftMode==='free';
  const allTakenIds=duel?(duel.takenIds||[]):[];
  const isDraftDone=duel?duel.pickIdx>=duel.order.length:false;
  const isMyTurn=!isDraftDone&&duel?.order[duel.pickIdx]?.chooser===myRole;
  const isVsBot=duel?.opponentId==='bot_demo'||duel?.challengerId==='bot_demo';
  const myColor='#4a9eff', oppColor2='#e84545';
  const roleColor=(role)=>role===myRole?myColor:oppColor2;
  const chColor=myRole==='challenger'?myColor:oppColor2;
  const opColor=myRole==='opponent'?myColor:oppColor2;
  useEffect(()=>{
    if(duel?.status==='r1done'){
      setDraftView('roster');
      setR1justDone(true);
      setShowRosterBeforeCoin(true);
    }
  },[duel?.status]);
  useEffect(()=>{
    if(!duel)return;
    const round2Done=duel.draftRound===2&&(duel.pickIdx>=duel.order.length);
    if(round2Done) setDraftView('roster');
  },[duel?.pickIdx,duel?.draftRound,duel?.order?.length]);
  useEffect(()=>()=>{
    simTimer.current&&clearTimeout(simTimer.current);
    simRunning.current=false;
  },[]);
  const runSimAnimation=(picks,finalScores,scoringRules)=>{
    if(simRunning.current)return;
    simRunning.current=true;
    simStarted.current=true;
    const events=buildSimEvents(picks,scoringRules||sc);
    let idx=0;
    const rs={challenger:0,opponent:0};
    const ip={challenger:Array(9).fill(null),opponent:Array(9).fill(null)};
    setSimEvents([]); setSimScores({...rs});
    setInningPts({challenger:[...ip.challenger],opponent:[...ip.opponent]});
    setSimDone(false); setScoreHistory([{ch:0,op:0,inn:0}]);
    const step=()=>{
      if(!simRunning.current)return;
      if(idx>=events.length){setSimDone(true);simRunning.current=false;return;}
      const ev=events[idx++];
      const prevCh=rs.challenger, prevOp=rs.opponent;
      rs[ev.role]=Math.round((rs[ev.role]+ev.pts)*10)/10;
      ip[ev.role][ev.inn-1]=Math.round(((ip[ev.role][ev.inn-1]||0)+ev.pts)*10)/10;
      setSimEvents(prev=>[...prev,ev]);
      setSimScores({challenger:rs.challenger,opponent:rs.opponent});
      setInningPts({challenger:[...ip.challenger],opponent:[...ip.opponent]});
      setScoreHistory(prev=>[...prev,{ch:rs.challenger,op:rs.opponent,inn:ev.inn}]);
      const myR=myRole,oppR=oppRole;
      const wasLeading=prevCh!==prevOp&&((myR==='challenger'?prevCh:prevOp)>(myR==='challenger'?prevOp:prevCh));
      const nowLeading=rs.challenger!==rs.opponent&&((myR==='challenger'?rs.challenger:rs.opponent)>(myR==='challenger'?rs.opponent:rs.challenger));
      if(!wasLeading&&nowLeading) notify('📈 You took the lead!',`${(myR==='challenger'?rs.challenger:rs.opponent).toFixed(1)} – ${(myR==='challenger'?rs.opponent:rs.challenger).toFixed(1)}`);
      if(wasLeading&&!nowLeading) notify('📉 You lost the lead',`${(myR==='challenger'?rs.challenger:rs.opponent).toFixed(1)} – ${(myR==='challenger'?rs.opponent:rs.challenger).toFixed(1)}`);
      simTimer.current=setTimeout(step,idx<=3?900:550);
    };
    simTimer.current=setTimeout(step,300);
  };
  useEffect(()=>{
    if(duel?.status==='complete'&&duel.finalScores&&!simStarted.current){
      runSimAnimation(duel.picks,duel.finalScores,duel.scoring||DSC);
    }
  },[duel?.id,duel?.status]);
  const applyPosPick=(d,slotIdx,pickerRole,chosenSide)=>{
    const otherRole=pickerRole==='challenger'?'opponent':'challenger';
    const otherSide=chosenSide==='away'?'home':'away';
    const sl=d.slots[slotIdx];
    const pickerName=pickerRole==='challenger'?d.challengerName:d.opponentName;
    const newAsgn={...d.assignments,[String(slotIdx)]:{[chosenSide]:pickerRole,[otherSide]:otherRole}};
    const pickerPlayer=sl[chosenSide];
    const otherPlayer=sl[otherSide];
    const newPickerPicks=pickerPlayer?[...d.picks[pickerRole],{...pickerPlayer,slotIdx,side:chosenSide}]:d.picks[pickerRole];
    const newOtherPicks=otherPlayer?[...d.picks[otherRole],{...otherPlayer,slotIdx,side:otherSide}]:d.picks[otherRole];
    const ni=d.pickIdx+1; const isLast=ni>=d.order.length; const isR1=(d.draftRound||1)===1;
    const ns=isLast?(isR1?'r1done':'ready'):'drafting';
    const logEntry=pickerPlayer?{name:pickerPlayer.name,pos:pickerPlayer.pos,pickerRole,pickerName}:null;
    const newLog=logEntry?[...(d.pickLog||[]),logEntry]:(d.pickLog||[]);
    return{...d,assignments:newAsgn,picks:{...d.picks,[pickerRole]:newPickerPicks,[otherRole]:newOtherPicks},pickIdx:ni,status:ns,pickLog:newLog};
  };
  const applyNLPick=(d,slotIdx,side,pickerRole)=>{
    const round=d.draftRound||1;
    const pickId=`r${round}_${slotIdx}_${side}`;
    const sl=d.slots[slotIdx]; const player=sl[side];
    if(!player)return null;
    const pickerName=pickerRole==='challenger'?d.challengerName:d.opponentName;
    const newTaken=[...(d.takenIds||[]),pickId];
    const newPick={...player,slotIdx,side,pickId,owner:pickerRole};
    const newPicks=[...d.picks[pickerRole],newPick];
    const ni=d.pickIdx+1; const isLast=ni>=d.order.length; const isR1=round===1;
    const ns=isLast?(isR1?'r1done':'ready'):'drafting';
    const newLog=[...(d.pickLog||[]),{name:player.name,pos:player.pos,pickerRole,pickerName}];
    return{...d,takenIds:newTaken,picks:{...d.picks,[pickerRole]:newPicks},pickIdx:ni,status:ns,pickLog:newLog};
  };
  const doBotPicksStep=useCallback(async(cur)=>{
    let d=cur;
    while(true){
      if(d.pickIdx>=d.order.length)break;
      if(d.order[d.pickIdx].chooser!==oppRole)break;
      const isNL=d.draftMode==='free';
      let next=null;
      if(isNL){
        const rnd=d.draftRound||1;
        for(let si=0;si<d.slots.length;si++){
          for(const side of['away','home']){
            const pid=`r${rnd}_${si}_${side}`;
            if(d.slots[si][side]&&!(d.takenIds||[]).includes(pid)){
              next=applyNLPick(d,si,side,oppRole); break;
            }
          }
          if(next)break;
        }
      } else {
        let picked=false;
        for(let si=0;si<d.slots.length;si++){
          if(!d.assignments[String(si)]){
            next=applyPosPick(d,si,oppRole,'away');
            picked=true; break;
          }
        }
        if(!picked) break;
      }
      if(!next)break;
      if((next.draftRound||1)===1&&next.pickIdx>=next.order.length&&!next.r2firstPick){
        next={...next,status:'r1done'};
        d=next; break;
      }
      d=next;
    }
    if(d.pickIdx!==cur.pickIdx||d.status!==cur.status){
      sset(`duel:${d.id}`,d); setActiveDuel(d);
      if(d.status==='drafting'&&d.order[d.pickIdx]?.chooser===myRole){
        notify('⚾ Your Pick!','It\'s your turn to draft. Get in there!');
      }
    }
  },[oppRole,setActiveDuel]);
  useEffect(()=>{
    if(!duel||!isVsBot)return;
    if(duel.status==='r1done')return;
    if(duel.status!=='drafting')return;
    if(isDraftDone)return;
    if(duel.order[duel.pickIdx]?.chooser===oppRole){
      const t=setTimeout(()=>{
        const fresh=duelRef.current;
        if(fresh&&fresh.status==='drafting'&&fresh.order[fresh.pickIdx]?.chooser===oppRole){
          doBotPicksStep(fresh);
        }
      },800);
      return()=>clearTimeout(t);
    }
  },[duel?.pickIdx,duel?.draftRound,duel?.id,duel?.status,doBotPicksStep]);
  const pick=async(slotIdx,side)=>{
    if(pickingRef.current)return;
    const d=duelRef.current;
    if(!d)return;
    const myTurn=d.pickIdx<d.order.length&&d.order[d.pickIdx]?.chooser===myRole;
    if(!myTurn){showToast("Not your turn!");return;}
    const sl=d.slots[slotIdx]; if(!sl?.[side])return;
    pickingRef.current=true;
    try{
      let updated;
      if(d.draftMode==='free'){
        const pickId=`r${d.draftRound||1}_${slotIdx}_${side}`;
        if((d.takenIds||[]).includes(pickId)){showToast("Already drafted!");return;}
        updated=applyNLPick(d,slotIdx,side,myRole); if(!updated)return;
      } else {
        if(d.assignments[String(slotIdx)]){showToast("Already drafted!");return;}
        updated=applyPosPick(d,slotIdx,myRole,side);
      }
      duelRef.current=updated;
      await sset(`duel:${d.id}`,updated);
      setActiveDuel(updated);
    }finally{
      pickingRef.current=false;
    }
  };
  const simulate=async()=>{
    const d=duelRef.current;
    if(!d||d.status==='complete')return;
    const picks={challenger:[...d.picks.challenger],opponent:[...d.picks.opponent]};
    ['challenger','opponent'].forEach(role=>{
      picks[role]=picks[role].map(p=>({...p,stats:genStats(p)})).map(p=>({...p,fpts:calcFpts(p,sc)}));
    });
    const finalScores={
      challenger:Math.round(picks.challenger.reduce((s,p)=>s+(p.fpts||0),0)*10)/10,
      opponent:Math.round(picks.opponent.reduce((s,p)=>s+(p.fpts||0),0)*10)/10,
    };
    const winner=finalScores.challenger>finalScores.opponent?'challenger':finalScores.opponent>finalScores.challenger?'opponent':'tie';
    const updated={...d,picks,finalScores,winner,status:'complete'};
    duelRef.current=updated;
    await sset(`duel:${d.id}`,updated); setActiveDuel(updated);
    const notifWon=winner===myRole, notifTie=winner==='tie';
    const notifMyScore=finalScores[myRole], notifOppScore=finalScores[oppRole];
    const notifOppName=myRole==='challenger'?duel.opponentName:duel.challengerName;
    notify(
      notifTie?'🤝 It\'s a tie!':notifWon?'🏆 You won!':'😬 You lost',
      `${notifMyScore.toFixed(1)} – ${notifOppScore.toFixed(1)} vs ${notifOppName}`
    );
    for(const[role,uid]of[['challenger',duel.challengerId],['opponent',duel.opponentId]]){
      let u=await sget(`user:${uid}`);
      if(!u&&uid===me.id)u=JSON.parse(localStorage.getItem('dd_me')||'null');
      if(u){const isWin=winner===role,isTie=winner==='tie';const upd={...u,wins:(u.wins||0)+(isWin?1:0),losses:(u.losses||0)+(!isWin&&!isTie?1:0),ties:(u.ties||0)+(isTie?1:0),games:(u.games||0)+1,totalPts:(u.totalPts||0)+finalScores[role]};sset(`user:${uid}`,upd);if(uid===me.id){localStorage.setItem('dd_me',JSON.stringify(upd));refreshMe();}}
    }
    const h2hKey=[duel.challengerId,duel.opponentId].sort().join('_');
    const h2h=(await sget(`h2h:${h2hKey}`))||[];
    h2h.unshift({duelId:duel.id,date:new Date().toLocaleDateString('en-US',{month:'short',day:'numeric'}),challengerId:duel.challengerId,opponentId:duel.opponentId,challengerName:duel.challengerName,opponentName:duel.opponentName,gameId:duel.gameId,finalScores,winner});
    await sset(`h2h:${h2hKey}`,h2h);
    const myRole2=duel.challengerId===me.id?'challenger':'opponent';
    const myScore2=finalScores[myRole2],oppScore2Sim=finalScores[myRole2==='challenger'?'opponent':'challenger'];
    const oppName2Sim=myRole2==='challenger'?duel.opponentName:duel.challengerName;
    const iWon2Sim=winner===myRole2,isTie2=winner==='tie';
    const hist=JSON.parse(localStorage.getItem('dd_my_history')||'[]');
    const myPicks2=picks[myRole2]||[];
    const oppPicks2=picks[myRole2==='challenger'?'opponent':'challenger']||[];
    const allPicks2=[...myPicks2,...oppPicks2].filter(p=>p.fpts!==undefined);
    const myActual2=myPicks2.reduce((s,p)=>s+(p.fpts||0),0);
    let optimal2=0;
    if(duel.draftMode==='free'){
      const n=myPicks2.length;
      optimal2=[...allPicks2].sort((a,b)=>(b.fpts||0)-(a.fpts||0)).slice(0,n).reduce((s,p)=>s+(p.fpts||0),0);
    } else {
      const posGroups={};
      allPicks2.forEach(p=>{const key=p.pos;if(!posGroups[key])posGroups[key]=[];posGroups[key].push(p.fpts||0);});
      optimal2=Object.values(posGroups).reduce((s,arr)=>s+Math.max(...arr),0);
    }
    const draftEfficiency2=optimal2>0?Math.min(100,Math.round((myActual2/optimal2)*100)):null;
    hist.unshift({date:new Date().toLocaleDateString('en-US',{month:'short',day:'numeric'}),oppName:oppName2Sim,gameId:duel.gameId,myScore:myScore2,oppScore:oppScore2Sim,iWon:iWon2Sim,isTie:isTie2,myRole:myRole2,challengerName:duel.challengerName,opponentName:duel.opponentName,picks:duel.picks,draftEfficiency:draftEfficiency2});
    localStorage.setItem('dd_my_history',JSON.stringify(hist.slice(0,50)));
    if(duel.seriesId){
      const s=await sget(`series:${duel.seriesId}`);
      if(s){
        const updatedGames=s.games.map(g=>g.duelId===duel.id?{
          ...g,status:'complete',winner,
          challengerScore:finalScores.challenger,
          opponentScore:finalScores.opponent,
        }:g);
        const cW=updatedGames.filter(g=>g.winner==='challenger').length;
        const oW=updatedGames.filter(g=>g.winner==='opponent').length;
        const toW=Math.ceil(s.numGames/2);
        const sDone=cW>=toW||oW>=toW;
        const nextIdx=updatedGames.findIndex(g=>g.status==='awaiting_lineup');
        if(nextIdx>=0&&!sDone) updatedGames[nextIdx]={...updatedGames[nextIdx],status:'awaiting_lineup'};
        const updatedSeries={...s,games:updatedGames,challengerWins:cW,opponentWins:oW,status:sDone?'complete':'active'};
        await sset(`series:${duel.seriesId}`,updatedSeries);
        if(sDone) notify(cW>=toW?'🏆 Series Win!':'😬 Series Over',`Final: ${cW}–${oW}`);
        else notify('⚾ Game Complete',`Series: ${cW}–${oW} · Game ${nextIdx+1} up next`);
      }
    }
    runSimAnimation(picks,finalScores,sc);
  };
  if(!duel)return(<div style={{...S.page,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16}}><div style={{color:'#6b7a8d',fontSize:14}}>No active duel.</div><button style={S.btnGold} onClick={()=>onNav('home')}>← Home</button></div>);
  if(!duel)return(<div style={{...S.page,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16}}><div style={{color:'#6b7a8d',fontSize:14}}>No active duel.</div><button style={S.btnGold} onClick={()=>onNav('home')}>← Home</button></div>);
  const p={duel,myRole,oppRole,sc,roleColor,chColor,opColor,myColor,oppColor2,onNav,game,G:games||GAMES,oppName};
  if(duel.status==='complete'||duel.status==='simulating'){
    return <SimView {...p} simEvents={simEvents} simScores={simScores} simDone={simDone} scoreHistory={scoreHistory} inningPts={inningPts}/>;
  }
  return <DraftView {...p} isNoLimits={isNoLimits} isDraftDone={isDraftDone} isMyTurn={isMyTurn} draftView={draftView} setDraftView={setDraftView} statFilter={statFilter} setStatFilter={setStatFilter} showRosterBeforeCoin={showRosterBeforeCoin} setShowRosterBeforeCoin={setShowRosterBeforeCoin} pick={pick} simulate={simulate}/>;
}
function SimView({duel,myRole,oppRole,sc,simEvents,simScores,simDone,scoreHistory,inningPts,roleColor,chColor,opColor,myColor,oppColor2,onNav,game}){
    const fs=duel.finalScores||{challenger:0,opponent:0};
    const winner=duel.winner; const displayScores=simEvents.length>0?simScores:fs;
    const iWon=winner===myRole,isTie=winner==='tie';
    const myName=myRole==='challenger'?duel.challengerName:duel.opponentName;
    const oppName2=myRole==='challenger'?duel.opponentName:duel.challengerName;
    const myScore=(displayScores[myRole]||0).toFixed(1),oppScore2=(displayScores[oppRole]||0).toFixed(1);
    const myTotal=fs[myRole]||0,oppTotal2=fs[oppRole]||0,maxTotal=Math.max(myTotal,oppTotal2,1);
    const quip=simDone&&!isTie?generateQuip(iWon?myName:oppName2,iWon?oppName2:myName,iWon?fs[myRole]:fs[oppRole],iWon?fs[oppRole]:fs[myRole],duel.picks?.[iWon?myRole:oppRole]||[],duel.picks?.[iWon?oppRole:myRole]||[]):null;
    const catBreakdown=[
      {label:'Pitching',my:(duel.picks?.[myRole]||[]).filter(p=>p.pos==='SP'||p.pos==='BULLPEN').reduce((s,p)=>s+(p.fpts||0),0),opp:(duel.picks?.[oppRole]||[]).filter(p=>p.pos==='SP'||p.pos==='BULLPEN').reduce((s,p)=>s+(p.fpts||0),0)},
      {label:'Offense',my:(duel.picks?.[myRole]||[]).filter(p=>p.pos!=='SP'&&p.pos!=='BULLPEN').reduce((s,p)=>s+(p.fpts||0),0),opp:(duel.picks?.[oppRole]||[]).filter(p=>p.pos!=='SP'&&p.pos!=='BULLPEN').reduce((s,p)=>s+(p.fpts||0),0)},
      ...(sc.def_enabled?[{label:'Fielding',
        my:(duel.picks?.[myRole]||[]).filter(p=>p.pos!=='SP'&&p.pos!=='BULLPEN').reduce((s,p)=>{const st=p.stats||{};return s+(st.putout||0)*sc.putout+(st.assist||0)*sc.assist+(st.caught_stealing||0)*sc.caught_stealing+(st.double_play||0)*sc.double_play+(st.error||0)*sc.error;},0),
        opp:(duel.picks?.[oppRole]||[]).filter(p=>p.pos!=='SP'&&p.pos!=='BULLPEN').reduce((s,p)=>{const st=p.stats||{};return s+(st.putout||0)*sc.putout+(st.assist||0)*sc.assist+(st.caught_stealing||0)*sc.caught_stealing+(st.double_play||0)*sc.double_play+(st.error||0)*sc.error;},0),
      }]:[]),
    ];
    return(<div style={S.page}><div style={S.wrap}>
      <div style={S.header}><button style={S.backBtn} onClick={()=>onNav('home')}>← Home</button><div style={{...S.display,fontSize:20,color:'#f5c842',letterSpacing:2}}>{simDone?'FINAL':'LIVE'}</div><div style={{width:60}}/></div>
      {/* Score hero */}
      <div style={{background:'#141b22',border:'1px solid #2a3540',borderRadius:12,padding:'14px 16px',marginBottom:10,display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:8,alignItems:'center',textAlign:'center'}}>
        <div><div style={{fontFamily:'monospace',fontSize:11,color:chColor,letterSpacing:1,marginBottom:2}}>{duel.challengerName}{simDone&&winner==='challenger'?' 🏆':''}</div><div style={{...S.display,fontSize:42,color:chColor,lineHeight:1}}>{(displayScores.challenger||0).toFixed(1)}</div></div>
        <div style={{...S.display,fontSize:16,color:'#6b7a8d'}}>VS</div>
        <div><div style={{fontFamily:'monospace',fontSize:11,color:opColor,letterSpacing:1,marginBottom:2}}>{duel.opponentName}{simDone&&winner==='opponent'?' 🏆':''}</div><div style={{...S.display,fontSize:42,color:opColor,lineHeight:1}}>{(displayScores.opponent||0).toFixed(1)}</div></div>
      </div>
      {/* Trend line chart — live momentum tracker */}
      {scoreHistory.length>1&&(()=>{
        const W=340, H=72, PAD=8;
        const n=scoreHistory.length;
        const allVals=scoreHistory.flatMap(p=>[p.ch,p.op]);
        const maxV=Math.max(...allVals,1);
        const minV=Math.min(...allVals,0);
        const range=Math.max(maxV-minV,1);
        const toX=(i)=>PAD+(i/(n-1))*(W-PAD*2);
        const toY=(v)=>H-PAD-(((v-minV)/range)*(H-PAD*2));
        const pts=(key)=>scoreHistory.map((p,i)=>`${toX(i).toFixed(1)},${toY(p[key]).toFixed(1)}`).join(' ');
        const chPts=pts('ch'); const opPts=pts('op');
        const lastCh=scoreHistory[n-1]; const chLeads=lastCh.ch>lastCh.op;
        const areaPath=(key,color)=>{
          const coords=scoreHistory.map((p,i)=>({x:toX(i),y:toY(p[key])}));
          const d=coords.map((c,i)=>(i===0?`M${c.x},${c.y}`:`L${c.x},${c.y}`)).join(' ')
            +` L${toX(n-1)},${H-PAD} L${toX(0)},${H-PAD} Z`;
          return <path key={key} d={d} fill={color} opacity="0.08"/>;
        };
        return(
          <div style={{background:'#0d1117',border:'1px solid #2a3540',borderRadius:10,padding:'10px 12px',marginBottom:10,position:'relative'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
              <div style={{fontFamily:'monospace',fontSize:9,color:'#6b7a8d',letterSpacing:1.5,textTransform:'uppercase'}}>Momentum</div>
              <div style={{display:'flex',gap:10}}>
                {[[chColor,duel.challengerName.split(' ')[0]],[opColor,duel.opponentName.split(' ')[0]]].map(([c,n])=>(
                  <div key={n} style={{display:'flex',alignItems:'center',gap:4}}>
                    <div style={{width:16,height:2,background:c,borderRadius:1}}/>
                    <span style={{fontFamily:'monospace',fontSize:9,color:c}}>{n}</span>
                  </div>
                ))}
              </div>
            </div>
            <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:'block',overflow:'visible'}}>
              {/* Grid lines */}
              {[0.25,0.5,0.75].map(t=>(
                <line key={t} x1={PAD} x2={W-PAD} y1={PAD+(1-t)*(H-PAD*2)} y2={PAD+(1-t)*(H-PAD*2)} stroke="#2a3540" strokeWidth="0.5" strokeDasharray="3,3"/>
              ))}
              {/* Zero line */}
              {minV<0&&<line x1={PAD} x2={W-PAD} y1={toY(0)} y2={toY(0)} stroke="#3a4a5a" strokeWidth="1"/>}
              {/* Filled areas */}
              {areaPath('ch',chColor)}
              {areaPath('op',opColor)}
              {/* Challenger line */}
              <polyline points={chPts} fill="none" stroke={chColor} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
              {/* Opponent line */}
              <polyline points={opPts} fill="none" stroke={opColor} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
              {/* Current score dots */}
              <circle cx={toX(n-1)} cy={toY(lastCh.ch)} r="3.5" fill={chColor} stroke="#0d1117" strokeWidth="1.5"/>
              <circle cx={toX(n-1)} cy={toY(lastCh.op)} r="3.5" fill={opColor} stroke="#0d1117" strokeWidth="1.5"/>
              {/* Score labels at end */}
              <text x={toX(n-1)+6} y={toY(lastCh.ch)+4} fill={chColor} fontSize="9" fontFamily="monospace" fontWeight="700">{lastCh.ch.toFixed(0)}</text>
              <text x={toX(n-1)+6} y={toY(lastCh.op)+4} fill={opColor} fontSize="9" fontFamily="monospace" fontWeight="700">{lastCh.op.toFixed(0)}</text>
            </svg>
          </div>
        );
      })()}
      {/* Inning scoreboard — always visible */}
      <div style={{background:'#141b22',border:'1px solid #2a3540',borderRadius:8,padding:'8px',marginBottom:10,overflowX:'auto'}}>
        <div style={{display:'flex',gap:3,minWidth:'max-content'}}>
          <div style={{display:'flex',flexDirection:'column',justifyContent:'flex-end',paddingRight:6,gap:2,flexShrink:0}}>
            <div style={{fontFamily:'monospace',fontSize:9,color:chColor,textAlign:'right',lineHeight:'16px'}}>{duel.challengerName.split(' ')[0]}</div>
            <div style={{fontFamily:'monospace',fontSize:9,color:opColor,textAlign:'right',lineHeight:'16px'}}>{duel.opponentName.split(' ')[0]}</div>
          </div>
          {Array.from({length:9},(_,i)=>(<div key={i} style={{flex:'0 0 30px',textAlign:'center',padding:'3px 2px',borderRadius:4,background:'#1c2630',border:'1px solid #2a3540'}}>
            <div style={{fontFamily:'monospace',fontSize:8,color:'#6b7a8d',lineHeight:'12px'}}>{i+1}</div>
            <div style={{fontFamily:"'Bebas Neue',Arial,serif",fontSize:13,color:chColor,lineHeight:'16px'}}>{inningPts.challenger[i]!==null?inningPts.challenger[i]:'·'}</div>
            <div style={{fontFamily:"'Bebas Neue',Arial,serif",fontSize:13,color:opColor,lineHeight:'16px'}}>{inningPts.opponent[i]!==null?inningPts.opponent[i]:'·'}</div>
          </div>))}
          <div style={{flex:'0 0 34px',textAlign:'center',padding:'3px 2px',borderRadius:4,background:'rgba(245,200,66,.06)',border:'1px solid rgba(245,200,66,.15)'}}>
            <div style={{fontFamily:'monospace',fontSize:8,color:'#f5c842',lineHeight:'12px'}}>TOT</div>
            <div style={{fontFamily:"'Bebas Neue',Arial,serif",fontSize:13,color:chColor,lineHeight:'16px'}}>{(displayScores.challenger||0).toFixed(0)}</div>
            <div style={{fontFamily:"'Bebas Neue',Arial,serif",fontSize:13,color:opColor,lineHeight:'16px'}}>{(displayScores.opponent||0).toFixed(0)}</div>
          </div>
        </div>
      </div>
      {/* ── DURING SIM: play by play (compact) then rosters ── */}
      {!simDone&&(<>
        {/* Play by play — compact, newest 3-4 plays only */}
        <div style={{background:'#141b22',border:'1px solid #2a3540',borderRadius:8,overflow:'hidden',marginBottom:10}}>
          <div style={{padding:'6px 12px',background:'#1c2630',borderBottom:'1px solid #2a3540',fontFamily:'monospace',fontSize:9,color:'#6b7a8d',letterSpacing:1.5,textTransform:'uppercase'}}>Play by Play</div>
          {simEvents.length===0
            ?<div style={{padding:'14px',textAlign:'center',color:'#6b7a8d',fontSize:12}}>Simulating…</div>
            :[...simEvents].reverse().slice(0,4).map((ev,i)=>(<div key={i} style={{display:'flex',gap:8,alignItems:'flex-start',padding:'6px 12px',borderBottom:i<Math.min(simEvents.length,4)-1?'1px solid rgba(42,53,64,.3)':'none'}}>
              <div style={{fontFamily:'monospace',fontSize:9,color:'#6b7a8d',minWidth:22,paddingTop:1,flexShrink:0}}>I{ev.inn}</div>
              <div style={{fontSize:11,flex:1,lineHeight:1.4,color:'#c0cad6'}}>{ev.desc}</div>
              <div style={{fontFamily:'monospace',fontSize:10,padding:'1px 5px',borderRadius:3,whiteSpace:'nowrap',flexShrink:0,background:ev.pts>0?(ev.role==='challenger'?'rgba(74,158,255,.12)':'rgba(232,69,69,.12)'):'rgba(107,122,141,.1)',color:ev.pts>0?roleColor(ev.role):'#6b7a8d'}}>{ev.pts>0?'+':''}{ev.pts}</div>
            </div>))
          }
        </div>
        {/* Live rosters */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:10}}>
          {[['challenger',chColor,duel.challengerName],['opponent',opColor,duel.opponentName]].map(([role,color,name])=>(<div key={role} style={{background:'#141b22',border:`1px solid ${color}33`,borderRadius:8,overflow:'hidden'}}>
            <div style={{padding:'6px 10px',background:color+'18',borderBottom:`1px solid ${color}22`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{fontFamily:'monospace',fontSize:10,color,fontWeight:700}}>{name.split(' ')[0]}</div>
              <div style={{fontFamily:'monospace',fontSize:12,color,fontWeight:700}}>{(displayScores[role]||0).toFixed(1)}</div>
            </div>
            {(duel.picks?.[role]||[]).map((p,i)=>(<LivePlayerRow key={i} p={p} role={role} myRole={myRole} myColor={myColor} oppColor2={oppColor2}/>))}
          </div>))}
        </div>
      </>)}
      {/* ── AFTER SIM: conclusion first, then everything else ── */}
      {simDone&&(<>
        {/* Conclusion banner */}
        <div style={{borderRadius:12,padding:'22px 16px',marginBottom:12,textAlign:'center',background:isTie?'rgba(107,122,141,.08)':iWon?'rgba(61,214,140,.07)':'rgba(232,69,69,.06)',border:`1px solid ${isTie?'rgba(107,122,141,.25)':iWon?'rgba(61,214,140,.25)':'rgba(232,69,69,.2)'}`}}>
          <div style={{fontSize:40,marginBottom:8}}>{isTie?'🤝':iWon?'🏆':'😬'}</div>
          <div style={{...S.display,fontSize:30,letterSpacing:2,color:isTie?'#6b7a8d':iWon?'#3dd68c':'#e84545',marginBottom:10}}>{isTie?'DEAD HEAT':iWon?'CONGRATS!':'BETTER LUCK NEXT TIME'}</div>
          <div style={{fontSize:13,color:'#8a9bb0',lineHeight:1.6,maxWidth:280,margin:'0 auto'}}>
            {isTie?`${myName} and ${oppName2} finish all square.`:iWon?`${myName} wins ${myScore}–${oppScore2}. Your lineup delivered.`:`${oppName2} wins ${oppScore2}–${myScore}. The margin stings, but that's the game.`}
          </div>
          {quip&&<div style={{marginTop:14,fontSize:12,color:'#6b7a8d',fontStyle:'italic'}}>"{quip}"</div>}
          {/* Series context */}
          {duel.seriesId&&duel.gameNum&&(
            <div style={{marginTop:14,padding:'8px 12px',background:'rgba(74,158,255,.08)',border:'1px solid rgba(74,158,255,.2)',borderRadius:8,display:'inline-block'}}>
              <div style={{fontFamily:'monospace',fontSize:10,color:'#4a9eff',fontWeight:700,letterSpacing:1}}>🔁 SERIES · GAME {duel.gameNum}</div>
              {duel.gameNum<(duel.numGames||3)&&<div style={{fontFamily:'monospace',fontSize:9,color:'#6b7a8d',marginTop:3}}>
                {iWon?`Come back for Game ${duel.gameNum+1} to keep the lead.`:`Game ${duel.gameNum+1} is your shot to even it up.`}
              </div>}
            </div>
          )}
        </div>
        {/* Total score bars */}
        <div style={{background:'#141b22',border:'1px solid #2a3540',borderRadius:10,padding:'14px',marginBottom:10}}>
          <div style={{fontFamily:'monospace',fontSize:9,color:'#6b7a8d',letterSpacing:1.5,textTransform:'uppercase',marginBottom:10}}>Total Points</div>
          {[{name:myName,score:myTotal,color:myColor},{name:oppName2,score:oppTotal2,color:oppColor2}].map((t,i)=>(<div key={i} style={{marginBottom:i===0?10:0}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}><span style={{fontFamily:'monospace',fontSize:10,color:t.color}}>{t.name}</span><span style={{fontFamily:'monospace',fontSize:12,color:t.color,fontWeight:700}}>{t.score.toFixed(1)}</span></div>
            <div style={{height:10,background:'#1c2630',borderRadius:5,overflow:'hidden'}}><div style={{height:'100%',width:`${(t.score/maxTotal)*100}%`,background:t.color,borderRadius:5}}/></div>
          </div>))}
        </div>
        {/* Category breakdown */}
        <div style={{background:'#141b22',border:'1px solid #2a3540',borderRadius:10,padding:'14px',marginBottom:10}}>
          <div style={{fontFamily:'monospace',fontSize:9,color:'#6b7a8d',letterSpacing:1.5,textTransform:'uppercase',marginBottom:10}}>Points by Category</div>
          {catBreakdown.map((cat,i)=>{const catMax=Math.max(cat.my,cat.opp,1);return(<div key={i} style={{marginBottom:i<catBreakdown.length-1?12:0}}>
            <div style={{fontFamily:'monospace',fontSize:9,color:'#6b7a8d',marginBottom:6,letterSpacing:.5}}>{cat.label.toUpperCase()}</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
              {[{score:cat.my,color:myColor,name:myName},{score:cat.opp,color:oppColor2,name:oppName2}].map((t,j)=>(<div key={j}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}><span style={{fontFamily:'monospace',fontSize:9,color:'#6b7a8d'}}>{t.name.split(' ')[0]}</span><span style={{fontFamily:'monospace',fontSize:10,color:t.color,fontWeight:700}}>{t.score.toFixed(1)}</span></div>
                <div style={{height:7,background:'#1c2630',borderRadius:3,overflow:'hidden'}}><div style={{height:'100%',width:`${(t.score/catMax)*100}%`,background:t.color,borderRadius:3}}/></div>
              </div>))}
            </div>
          </div>);})}
        </div>
        {/* Draft Efficiency card */}
        {(()=>{
          const myPicks=duel.picks?.[myRole]||[];
          const oppPicks=duel.picks?.[oppRole]||[];
          const allPicks=[...myPicks,...oppPicks].filter(p=>p.fpts!==undefined);
          if(allPicks.length===0)return null;
          const myActual=myPicks.reduce((s,p)=>s+(p.fpts||0),0);
          let optimal=0;
          const isNL=duel.draftMode==='free';
          if(isNL){
            const n=myPicks.length;
            const sorted=[...allPicks].sort((a,b)=>(b.fpts||0)-(a.fpts||0));
            optimal=sorted.slice(0,n).reduce((s,p)=>s+(p.fpts||0),0);
          } else {
            const paired=myPicks.map((p,i)=>({
              me:p.fpts||0,
              opp:oppPicks[i]?.fpts||0,
            }));
            optimal=paired.reduce((s,pair)=>s+Math.max(pair.me,pair.opp),0);
          }
          optimal=Math.max(optimal,myActual);
          const rawPct=optimal>0?Math.round((myActual/optimal)*100):100;
          const pct=Math.min(rawPct,100);
          const grade=pct>=95?{label:'Elite',color:'#3dd68c',icon:'💎',msg:isNL?'Near-perfect snake draft. You maximized every pick.':'You took the best side almost every time.'}
            :pct>=85?{label:'Solid',color:'#4a9eff',icon:'🔥',msg:isNL?'Strong draft. A couple picks away from optimal.':'Good instincts — most slots went your way.'}
            :pct>=70?{label:'Average',color:'#f5c842',icon:'⚾',msg:isNL?'Decent, but the top scorers slipped by.':'You won some matchups, lost some.'}
            :pct>=50?{label:'Below Avg',color:'#ff7c3a',icon:'📉',msg:isNL?'The better players were available but not picked.':'Your opponent consistently took the stronger side.'}
            :{label:'Rough',color:'#e84545',icon:'😬',msg:isNL?'The stats didn\'t go your way this draft.':'Tough draw — the better players weren\'t on your side.'};
          const R=38, cx=52, cy=52, stroke=8;
          const circ=2*Math.PI*R;
          const arcLen=(pct/100)*circ*0.75;
          const dashArr=`${arcLen} ${circ}`;
          const startAngle=135;
          const modeLabel=isNL?'Snake Draft':'By Position';
          const modeNote=isNL
            ?`Top ${myPicks.length} scorers available scored ${optimal.toFixed(1)} pts combined`
            :`Best side per slot would have scored ${optimal.toFixed(1)} pts`;
          return(
            <div style={{background:'#141b22',border:`1px solid ${grade.color}33`,borderRadius:10,padding:'14px',marginBottom:10}}>
              <div style={{fontFamily:'monospace',fontSize:9,color:'#6b7a8d',letterSpacing:1.5,textTransform:'uppercase',marginBottom:10,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span>Draft Efficiency</span>
                <span style={{color:grade.color,fontSize:8,padding:'2px 6px',border:`1px solid ${grade.color}44`,borderRadius:3}}>{modeLabel}</span>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:16}}>
                {/* Gauge arc */}
                <div style={{flexShrink:0,position:'relative',width:104,height:104}}>
                  <svg width="104" height="104" viewBox="0 0 104 104">
                    {/* Track */}
                    <circle cx={cx} cy={cy} r={R} fill="none" stroke="#2a3540" strokeWidth={stroke}
                      strokeDasharray={`${circ*0.75} ${circ}`}
                      strokeDashoffset={0}
                      strokeLinecap="round"
                      transform={`rotate(${startAngle} ${cx} ${cy})`}/>
                    {/* Fill */}
                    <circle cx={cx} cy={cy} r={R} fill="none" stroke={grade.color} strokeWidth={stroke}
                      strokeDasharray={dashArr}
                      strokeDashoffset={0}
                      strokeLinecap="round"
                      transform={`rotate(${startAngle} ${cx} ${cy})`}
                      style={{transition:'stroke-dasharray .6s ease'}}/>
                    {/* Center text */}
                    <text x={cx} y={cy-6} textAnchor="middle" fill={grade.color} fontSize="18" fontWeight="700" fontFamily="'Bebas Neue',Arial,serif">{pct}%</text>
                    <text x={cx} y={cy+10} textAnchor="middle" fill={grade.color} fontSize="9" fontFamily="monospace" fontWeight="700">{grade.label}</text>
                    <text x={cx} y={cy+22} textAnchor="middle" fill="#6b7a8d" fontSize="8" fontFamily="monospace">{grade.icon}</text>
                  </svg>
                </div>
                {/* Right side text */}
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,color:'#e8edf2',marginBottom:4,lineHeight:1.3}}>{grade.msg}</div>
                  <div style={{fontFamily:'monospace',fontSize:9,color:'#6b7a8d',lineHeight:1.5,marginBottom:8}}>{modeNote}</div>
                  {/* Pts comparison */}
                  <div style={{display:'flex',gap:12}}>
                    <div>
                      <div style={{fontFamily:'monospace',fontSize:8,color:'#6b7a8d',marginBottom:2}}>YOUR SCORE</div>
                      <div style={{fontFamily:'monospace',fontSize:14,color:myColor,fontWeight:700}}>{myActual.toFixed(1)}</div>
                    </div>
                    <div style={{width:1,background:'#2a3540'}}/>
                    <div>
                      <div style={{fontFamily:'monospace',fontSize:8,color:'#6b7a8d',marginBottom:2}}>OPTIMAL</div>
                      <div style={{fontFamily:'monospace',fontSize:14,color:grade.color,fontWeight:700}}>{optimal.toFixed(1)}</div>
                    </div>
                    <div style={{width:1,background:'#2a3540'}}/>
                    <div>
                      <div style={{fontFamily:'monospace',fontSize:8,color:'#6b7a8d',marginBottom:2}}>LEFT ON TABLE</div>
                      <div style={{fontFamily:'monospace',fontSize:14,color:'#6b7a8d',fontWeight:700}}>{Math.max(0,optimal-myActual).toFixed(1)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
        {/* Player of the Game */}
        {(()=>{
          const allPlayers=[
            ...(duel.picks?.challenger||[]).map(p=>({...p,teamRole:'challenger',teamColor:chColor,teamName:duel.challengerName})),
            ...(duel.picks?.opponent||[]).map(p=>({...p,teamRole:'opponent',teamColor:opColor,teamName:duel.opponentName})),
          ].filter(p=>p.fpts!==undefined);
          const potg=allPlayers.reduce((best,p)=>Math.abs(p.fpts||0)>Math.abs(best.fpts||0)?p:best,allPlayers[0]);
          if(!potg)return null;
          const s=potg.stats;
          let statLine='';
          if(s){
            if(potg.pos==='SP'||potg.pos==='BULLPEN') statLine=`${s.ip}IP · ${s.k}K · ${s.er}ER${s.w?' · W':''}${s.sv?' · SV':''}`;
            else{const hits=[s.hr?`${s.hr}HR`:'',s.triple?`${s.triple}3B`:'',s.double?`${s.double}2B`:'',s.single?`${s.single}H`:''].filter(Boolean);statLine=`${hits.length?hits.join(' '):'0H'} · ${s.rbi}RBI · ${s.run}R${s.sb?' · SB':''}`;}
          }
          return(
            <div style={{marginBottom:10,borderRadius:12,overflow:'hidden',border:`1px solid ${potg.teamColor}55`,background:`linear-gradient(135deg,#141b22,${potg.teamColor}0a)`}}>
              <div style={{padding:'7px 14px',background:potg.teamColor+'22',borderBottom:`1px solid ${potg.teamColor}33`,display:'flex',alignItems:'center',gap:6}}>
                <span style={{fontSize:14}}>⭐</span>
                <span style={{fontFamily:'monospace',fontSize:9,color:potg.teamColor,letterSpacing:1.5,textTransform:'uppercase',fontWeight:700}}>Player of the Game</span>
                <span style={{fontFamily:'monospace',fontSize:9,color:'#6b7a8d',marginLeft:'auto'}}>{potg.teamName}</span>
              </div>
              <div style={{padding:'12px 14px',display:'flex',alignItems:'center',gap:12}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:18,fontWeight:700,color:'#f0ece4',marginBottom:3}}>{potg.name}</div>
                  <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',marginBottom:6}}>{potg.pos}{statLine?' · '+statLine:''}</div>
                  <div style={{fontFamily:'monospace',fontSize:11,color:'#6b7a8d'}}>Fantasy Points</div>
                </div>
                <div style={{textAlign:'right',flexShrink:0}}>
                  <div style={{fontFamily:"'Bebas Neue',Arial,serif",fontSize:44,color:potg.teamColor,lineHeight:1}}>{potg.fpts>0?'+':''}{potg.fpts}</div>
                </div>
              </div>
            </div>
          );
        })()}
        {/* Final rosters — sorted highest to lowest fpts */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:10}}>
          {[['challenger',chColor,duel.challengerName],['opponent',opColor,duel.opponentName]].map(([role,color,name])=>{
            const sorted=[...(duel.picks?.[role]||[])].sort((a,b)=>(b.fpts||0)-(a.fpts||0));
            return(<div key={role} style={{background:'#141b22',border:`1px solid ${color}33`,borderRadius:8,overflow:'hidden'}}>
              <div style={{padding:'6px 10px',background:color+'18',borderBottom:`1px solid ${color}22`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{fontFamily:'monospace',fontSize:10,color,fontWeight:700}}>{name.split(' ')[0]}</div>
                <div style={{fontFamily:'monospace',fontSize:12,color,fontWeight:700}}>{(displayScores[role]||0).toFixed(1)}</div>
              </div>
              {sorted.map((p,i)=>(<LivePlayerRow key={i} p={p} role={role} myRole={myRole} myColor={myColor} oppColor2={oppColor2}/>))}
            </div>);
          })}
        </div>
        {/* Play by play — collapsed, very bottom */}
        <CollapsedPlayByPlay simEvents={simEvents} roleColor={roleColor}/>
        <button style={{...S.btnOutline,width:'100%',marginTop:8}} onClick={()=>onNav('home')}>← Back to Home</button>
      </>)}
    </div></div>);
}
function DraftView({duel,myRole,oppRole,sc,isNoLimits,isDraftDone,isMyTurn,draftView,setDraftView,statFilter,setStatFilter,showRosterBeforeCoin,setShowRosterBeforeCoin,pick,simulate,game,G,chColor,opColor,myColor,oppColor2,oppName,onNav}){
  const draftRound=duel.draftRound||1;
  const isDraftRound1Done=duel.status==='r1done'||(isDraftDone&&draftRound===1&&!duel.r2firstPick);
  const showR2Coin=isDraftRound1Done&&!showRosterBeforeCoin;
  const subSections=draftRound===1?[{label:'Starting Pitcher',phase:'sp'},{label:'Bullpen',phase:'bullpen'}]:[{label:'Starting Lineup',phase:'lineup'},{label:'Bench',phase:'bench'}];
  const startRound2=async(r2fp)=>{
    const game2=G.find(g=>g.id===duel.gameId);
    const r2slots=buildSlotsForRound(game2,2);
    const r2order=buildOrder(r2fp,r2slots,duel.draftMode);
    const updated={...duel,slots:r2slots,order:r2order,pickIdx:0,draftRound:2,r2firstPick:r2fp,status:'drafting',assignments:{},takenIds:[],pickLog:[]};
    await sset(`duel:${duel.id}`,updated); setActiveDuel(updated);
    setDraftView('board');
  };
  return(<div style={S.page}><div style={S.wrap}>
    <div style={S.header}><button style={S.backBtn} onClick={()=>onNav('home')}>← Home</button><div style={{...S.display,fontSize:20,color:'#f5c842',letterSpacing:2}}>DRAFT</div>
      <div style={{fontFamily:'monospace',fontSize:13,color:'#f5c842',background:'rgba(245,200,66,.1)',border:'1px solid rgba(245,200,66,.2)',borderRadius:6,padding:'3px 10px'}}>{showR2Coin?'🪙':isDraftDone?'✓':duel.pickIdx+1}</div>
    </div>
    {/* Names */}
    <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:8,alignItems:'center',marginBottom:12}}>
      <div><div style={{...S.display,fontSize:17,color:chColor}}>{duel.challengerName}</div>{(draftRound===1?duel.firstPick:duel.r2firstPick)==='challenger'&&<div style={S.fpBadge}>👑 First</div>}</div>
      <div style={{textAlign:'center',background:'#1c2630',border:'1px solid #2a3540',borderRadius:8,padding:'5px 12px'}}>
        <div style={{...S.display,fontSize:22,color:'#f5c842',lineHeight:1}}>{showR2Coin?'🪙':isDraftDone?'✓':duel.pickIdx+1}</div>
        <div style={{fontFamily:'monospace',fontSize:9,color:'#6b7a8d',letterSpacing:1}}>{showR2Coin?'FLIP':isDraftDone?'DONE':'PICK'}</div>
      </div>
      <div style={{textAlign:'right'}}><div style={{...S.display,fontSize:17,color:opColor}}>{duel.opponentName}</div>{(draftRound===1?duel.firstPick:duel.r2firstPick)==='opponent'&&<div style={{...S.fpBadge,justifyContent:'flex-end'}}>👑 First</div>}</div>
    </div>
    {/* Round tabs */}
    <div style={{display:'flex',gap:6,marginBottom:12}}>
      {[1,2].map(r=>(<div key={r} style={{flex:1,textAlign:'center',padding:'6px 4px',borderRadius:5,fontFamily:'monospace',fontSize:10,letterSpacing:.5,textTransform:'uppercase',border:`1px solid ${draftRound===r?'#f5c842':draftRound>r?'rgba(61,214,140,.25)':'#2a3540'}`,background:draftRound===r?'rgba(245,200,66,.1)':draftRound>r?'rgba(61,214,140,.07)':'#141b22',color:draftRound===r?'#f5c842':draftRound>r?'#3dd68c':'#6b7a8d'}}>{r===1?'Round 1: Pitchers':'Round 2: Batters'}{draftRound>r?' ✓':''}</div>))}
    </div>
    {/* Color legend */}
    {!showR2Coin&&(
      <div style={{display:'flex',gap:8,marginBottom:10,padding:'7px 10px',background:'#141b22',borderRadius:7,border:'1px solid #2a3540'}}>
        <div style={{fontFamily:'monospace',fontSize:9,color:'#6b7a8d',letterSpacing:1,textTransform:'uppercase',flexShrink:0,paddingTop:1}}>Picks:</div>
        {[[myColor,myRole==='challenger'?duel.challengerName:duel.opponentName,'You'],[oppColor2,myRole==='challenger'?duel.opponentName:duel.challengerName,'Them']].map(([color,name,label])=>(
          <div key={label} style={{display:'flex',alignItems:'center',gap:4}}>
            <div style={{width:10,height:10,borderRadius:2,background:color,flexShrink:0}}/>
            <div style={{fontFamily:'monospace',fontSize:9,color,fontWeight:600}}>{name.split(' ')[0]}</div>
          </div>
        ))}
      </div>
    )}
    {showR2Coin&&<MidDraftCoin duel={duel} myRole={myRole} onFlip={startRound2}/>}
    {!showR2Coin&&(<>
      {/* Last pick bar */}
      {(duel.pickLog||[]).length>0&&(()=>{
        const last=(duel.pickLog||[])[(duel.pickLog||[]).length-1];
        const color=last.pickerRole===myRole?myColor:oppColor2;
        return(<div style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:7,marginBottom:10,background:'rgba(255,255,255,.03)',border:'1px solid #2a3540'}}>
          <div style={{fontFamily:'monospace',fontSize:9,color:'#6b7a8d',letterSpacing:1,textTransform:'uppercase',flexShrink:0}}>Last Pick</div>
          <div style={{fontFamily:'monospace',fontSize:10,color,flexShrink:0,fontWeight:600}}>{last.pickerName}</div>
          <div style={{flex:1,fontSize:13,fontWeight:700,color:'#e8edf2'}}>{last.name}</div>
          <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',flexShrink:0}}>{last.pos}</div>
        </div>);
      })()}
      {/* Turn banner */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'8px 14px',borderRadius:7,marginBottom:12,fontSize:13,fontWeight:600,border:'1px solid',borderColor:isDraftDone?'rgba(61,214,140,.25)':isMyTurn?'rgba(74,158,255,.25)':'rgba(232,69,69,.25)',background:isDraftDone?'rgba(61,214,140,.07)':isMyTurn?'rgba(74,158,255,.07)':'rgba(232,69,69,.07)',color:isDraftDone?'#3dd68c':isMyTurn?'#4a9eff':'#e84545'}}>
        {isDraftDone?'✅ Round complete!':(isMyTurn?(isNoLimits?'Your pick — click any available player':'Your pick — choose any position, then pick a side'):`Waiting for ${oppName}…`)}
      </div>
      {/* Board / Roster toggle */}
      <div style={{display:'flex',gap:0,marginBottom:10,background:'#1c2630',border:'1px solid #2a3540',borderRadius:7,overflow:'hidden'}}>
        {[['board','📋 Draft Board'],['roster','👥 My Roster']].map(([v,label])=>(
          <button key={v} onClick={()=>setDraftView(v)} style={{flex:1,padding:'8px 0',background:draftView===v?'rgba(245,200,66,.1)':'none',border:'none',borderRight:v==='board'?'1px solid #2a3540':'none',color:draftView===v?'#f5c842':'#6b7a8d',fontFamily:'monospace',fontSize:11,letterSpacing:.5,cursor:'pointer',transition:'all .15s'}}>{label}</button>
        ))}
      </div>
      {/* Stat filter strip — only shown on board view */}
      {draftView==='board'&&(
        <div style={{marginBottom:10,overflowX:'auto',WebkitOverflowScrolling:'touch'}}>
          <div style={{display:'flex',gap:6,paddingBottom:2,minWidth:'max-content'}}>
            {STAT_FILTERS.map(f=>(
              <button key={f.id} onClick={()=>setStatFilter(f.id)} title={f.desc} style={{
                padding:'5px 10px',borderRadius:20,border:`1px solid ${statFilter===f.id?'#f5c842':'#2a3540'}`,
                background:statFilter===f.id?'rgba(245,200,66,.12)':'#1c2630',
                color:statFilter===f.id?'#f5c842':'#6b7a8d',
                fontFamily:'monospace',fontSize:10,letterSpacing:.3,cursor:'pointer',
                fontWeight:statFilter===f.id?700:400,whiteSpace:'nowrap',flexShrink:0,
              }}>{f.label}</button>
            ))}
          </div>
          <div style={{fontFamily:'monospace',fontSize:9,color:'#3a4a5a',marginTop:4}}>
            {STAT_FILTERS.find(f=>f.id===statFilter)?.desc}
          </div>
        </div>
      )}
      {/* ── ROSTER VIEW ── */}
      {draftView==='roster'&&(()=>{
        const round2Done=draftRound===2&&isDraftDone;
        return(
          <div style={{marginBottom:12}}>
            {/* Section headers for round 2 complete view */}
            {[['challenger',chColor,duel.challengerName,myRole==='challenger'],['opponent',opColor,duel.opponentName,myRole==='opponent']].map(([role,color,name,isMe])=>{
              const allPicks=duel.picks?.[role]||[];
              const pitchers=allPicks.filter(p=>p.pos==='SP'||p.pos==='BULLPEN');
              const lineup=allPicks.filter(p=>p.pos!=='SP'&&p.pos!=='BULLPEN'&&p.pos!=='BN');
              const bench=allPicks.filter(p=>p.pos==='BN');
              return null;
            })}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              {[['challenger',chColor,duel.challengerName,myRole==='challenger'],['opponent',opColor,duel.opponentName,myRole==='opponent']].map(([role,color,name,isMe])=>{
                const allPicks=duel.picks?.[role]||[];
                if(!round2Done){
                  return(
                    <div key={role} style={{background:'#141b22',border:`1px solid ${color}33`,borderRadius:10,overflow:'hidden'}}>
                      <div style={{padding:'7px 10px',background:color+'18',borderBottom:`1px solid ${color}22`,display:'flex',alignItems:'center',gap:6}}>
                        <div style={{fontFamily:'monospace',fontSize:10,color,fontWeight:700,flex:1}}>{name.split(' ')[0]}{isMe?' (You)':''}</div>
                        <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d'}}>{allPicks.length} picks</div>
                      </div>
                      {allPicks.length===0
                        ?<div style={{padding:'14px 10px',textAlign:'center',color:'#6b7a8d',fontSize:11}}>No picks yet</div>
                        :allPicks.map((p,i)=>(
                          <div key={i} style={{display:'flex',alignItems:'center',gap:6,padding:'5px 8px',borderBottom:'1px solid rgba(42,53,64,.35)'}}>
                            <PlayerPhoto p={p} size={24} borderColor={color}/>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontSize:11,fontWeight:600,color:'#e8edf2',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name}</div>
                              <div style={{fontFamily:'monospace',fontSize:9,color:'#6b7a8d'}}>{p.pos}</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  );
                }
                const pitchers=allPicks.filter(p=>p.pos==='SP'||p.pos==='BULLPEN');
                const lineup=allPicks.filter(p=>p.pos!=='SP'&&p.pos!=='BULLPEN'&&p.pos!=='BN');
                const bench=allPicks.filter(p=>p.pos==='BN');
                const Section=({label,players,sectionColor})=>(players.length===0?null:(
                  <div style={{borderBottom:'1px solid rgba(42,53,64,.3)'}}>
                    <div style={{padding:'4px 8px',background:'rgba(255,255,255,.02)',fontFamily:'monospace',fontSize:8,color:sectionColor||'#6b7a8d',letterSpacing:1,textTransform:'uppercase'}}>{label}</div>
                    {players.map((p,i)=>(
                      <div key={i} style={{display:'flex',alignItems:'center',gap:5,padding:'4px 8px',borderBottom:i<players.length-1?'1px solid rgba(42,53,64,.2)':'none'}}>
                        <PlayerPhoto p={p} size={22} borderColor={color}/>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:10,fontWeight:600,color:'#e8edf2',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name}</div>
                          <div style={{fontFamily:'monospace',fontSize:8,color:'#6b7a8d'}}>{p.pos}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ));
                return(
                  <div key={role} style={{background:'#141b22',border:`1px solid ${color}33`,borderRadius:10,overflow:'hidden'}}>
                    <div style={{padding:'7px 10px',background:color+'18',borderBottom:`1px solid ${color}22`}}>
                      <div style={{fontFamily:'monospace',fontSize:10,color,fontWeight:700}}>{name.split(' ')[0]}{isMe?' (You)':''}</div>
                    </div>
                    <Section label="Pitchers" players={pitchers} sectionColor={color}/>
                    <Section label="Lineup" players={lineup} sectionColor={color}/>
                    <Section label="Bench" players={bench} sectionColor={color}/>
                    {allPicks.length===0&&<div style={{padding:'14px 10px',textAlign:'center',color:'#6b7a8d',fontSize:11}}>No picks yet</div>}
                  </div>
                );
              })}
            </div>
            {/* Enter Batters Draft button when round 1 is done */}
            {draftRound===1&&isDraftDone&&duel.status==='r1done'&&showRosterBeforeCoin&&(
              <div style={{marginTop:12}}>
                <button
                  style={{...S.btnGold,width:'100%',fontSize:15,padding:'14px',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}
                  onClick={()=>setShowRosterBeforeCoin(false)}
                >
                  <span>⚾</span><span>Enter Batters Draft</span><span style={{marginLeft:4}}>→</span>
                </button>
                <div style={{textAlign:'center',fontFamily:'monospace',fontSize:10,color:'#6b7a8d',marginTop:8}}>
                  Pitchers locked in · Flip for batting draft order
                </div>
              </div>
            )}
          </div>
        );
      })()}
      {/* ── BOARD VIEW ── */}
      {draftView==='board'&&(<>
        {subSections.map(sec=>{
        const secSlots=duel.slots.map((s,i)=>({...s,idx:i})).filter(s=>s.phase===sec.phase);
        if(secSlots.length===0)return null;
        return(<div key={sec.phase} style={{marginBottom:12}}>
          <div style={{fontFamily:'monospace',fontSize:10,color:'#6b7a8d',letterSpacing:1.5,textTransform:'uppercase',marginBottom:6,paddingLeft:2}}>{sec.label}</div>
          <div style={{background:'#141b22',border:'1px solid #2a3540',borderRadius:10,overflow:'hidden'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 52px 1fr',background:'#1c2630',borderBottom:'1px solid #2a3540'}}>
              <div style={{padding:'7px 12px',fontFamily:"'Bebas Neue',Arial,serif",fontSize:13,letterSpacing:2,color:'#e8edf2'}}>{game?.away}</div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'monospace',fontSize:9,color:'#6b7a8d',letterSpacing:1}}>POS</div>
              <div style={{padding:'7px 12px',fontFamily:"'Bebas Neue',Arial,serif",fontSize:13,letterSpacing:2,color:'#e8edf2',textAlign:'right'}}>{game?.home}</div>
            </div>
            {secSlots.map(sl=>{
              const asgn=duel.assignments[String(sl.idx)]||{};
              const slotFullyAssigned=!!(asgn.away&&asgn.home);
              const slotAvailable=!isNoLimits&&!slotFullyAssigned&&!isDraftDone&&isMyTurn;
              const renderCell=(side)=>{
                const player=sl[side];
                const pickId=`r${draftRound}_${sl.idx}_${side}`;
                let takenBy=null;
                if(isNoLimits){
                  const allPicks=[
                    ...duel.picks.challenger.map(p=>({...p,_role:'challenger'})),
                    ...duel.picks.opponent.map(p=>({...p,_role:'opponent'}))
                  ];
                  const match=allPicks.find(p=>p.pickId===pickId);
                  if(match) takenBy=match._role;
                } else {
                  takenBy=asgn[side]||null;
                }
                const canPick=!isDraftDone&&isMyTurn&&player&&!takenBy&&(isNoLimits?true:!slotFullyAssigned);
                const takenByMe=takenBy===myRole; const takenByOpp=takenBy===oppRole;
                const bg=takenByMe?`${myColor}12`:takenByOpp?`${oppColor2}12`:canPick?'rgba(245,200,66,.06)':'transparent';
                const accent=takenByMe?myColor:takenByOpp?oppColor2:null;
                const takenName=takenBy==='challenger'?duel.challengerName:duel.opponentName;
                return(
                  <div key={side} onClick={()=>canPick&&pick(sl.idx,side)} style={{padding:'6px 10px',cursor:canPick?'pointer':'default',background:bg,transition:'background .12s',opacity:takenBy?0.45:1,
                    borderLeft:side==='away'?(accent?`3px solid ${accent}`:canPick&&!takenBy?'3px solid rgba(245,200,66,.4)':'3px solid transparent'):'none',
                    borderRight:side==='home'?(accent?`3px solid ${accent}`:canPick&&!takenBy?'3px solid rgba(245,200,66,.4)':'3px solid transparent'):'none'}}>
                    {player?(
                      <div style={{display:'flex',alignItems:'center',gap:6,flexDirection:side==='home'?'row-reverse':'row'}}>
                        <PlayerPhoto p={player} size={28} borderColor={accent||(canPick?'rgba(245,200,66,.4)':undefined)}/>
                        <div style={{flex:1,minWidth:0,textAlign:side==='home'?'right':'left'}}>
                          <div style={{display:'flex',alignItems:'center',gap:4,flexDirection:side==='home'?'row-reverse':'row'}}>
                            <div style={{fontSize:12,fontWeight:600,color:canPick?'#f0ece4':'#a0aab4',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{player.name}</div>
                            {isNoLimits&&sec.phase==='lineup'&&<div style={{fontFamily:'monospace',fontSize:9,color:'#6b7a8d',background:'#1c2630',border:'1px solid #2a3540',borderRadius:3,padding:'0px 4px',flexShrink:0}}>{player.pos}</div>}
                          </div>
                          <div style={{fontFamily:'monospace',fontSize:9,color:'#6b7a8d',marginTop:1}}>{slotMetaTxt(player,game,side,statFilter)}</div>
                          {takenBy&&<div style={{fontFamily:'monospace',fontSize:9,padding:'1px 5px',borderRadius:3,display:'inline-block',marginTop:2,background:`${accent}22`,color:accent}}>{takenName}</div>}
                        </div>
                      </div>
                    ):<div style={{color:'#3a4a5a',fontSize:12,textAlign:'center'}}>—</div>}
                  </div>
                );
              };
              return(
                <div key={sl.idx} style={{display:'grid',gridTemplateColumns:'1fr 52px 1fr',borderBottom:'1px solid rgba(42,53,64,.35)'}}>
                  {renderCell('away')}
                  <div style={{display:'flex',alignItems:'center',justifyContent:'center',borderLeft:'1px solid rgba(42,53,64,.5)',borderRight:'1px solid rgba(42,53,64,.5)'}}>
                    <div style={{fontFamily:'monospace',fontSize:10,fontWeight:700,padding:'2px 4px',borderRadius:4,
                      background:slotAvailable?'rgba(245,200,66,.1)':slotFullyAssigned?'rgba(42,53,64,.5)':'#1c2630',
                      border:`1px solid ${slotAvailable?'rgba(245,200,66,.3)':slotFullyAssigned?'#2a3540':'#2a3540'}`,
                      color:slotAvailable?'#f5c842':slotFullyAssigned?'#3a4a5a':'#6b7a8d',textAlign:'center',minWidth:40}}>
                      {isNoLimits&&sec.phase==='lineup'?(secSlots.findIndex(s=>s.idx===sl.idx)+1):sl.posLabel}
                    </div>
                  </div>
                  {renderCell('home')}
                </div>
              );
            })}
          </div>
        </div>);
      })}
      </>)}
      {/* Simulate button — outside board/roster toggle, always visible when ready */}
      {isDraftDone&&draftRound===2&&duel.status==='ready'&&(<button style={{...S.btnGold,width:'100%',marginTop:4,fontSize:16,padding:'14px'}} onClick={simulate}>⚾ Play Ball</button>)}
      {isDraftDone&&draftRound===2&&duel.status==='drafting'&&(<div style={{textAlign:'center',padding:'12px',color:'#6b7a8d',fontSize:13,fontFamily:'monospace'}}>Waiting for opponent to finish…</div>)}
    </>)}
  </div></div>);
}
function App(){
  const [screen,setScreen]=useState('loading');
  const [me,setMe]=useState(null);
  const [friends,setFriends]=useState([]);
  const [challenges,setChallenges]=useState([]);
  const [activeDuel,setActiveDuel]=useState(null);
  const [toastMsg,setToastMsg]=useState('');
  const [tick,setTick]=useState(0);
  const [games,setGames]=useState(FALLBACK_GAMES);
  const [gamesLoading,setGamesLoading]=useState(true);
  const activeDuelId=useRef(null);
  const showToast=useCallback((msg)=>{setToastMsg(msg);setTimeout(()=>setToastMsg(''),2800);},[]);
  const refresh=()=>setTick(t=>t+1);
  useEffect(()=>{
    const init=async()=>{
      const liveGames=await fetchMLBGames();
      if(liveGames&&liveGames.length>0){
        GAMES=liveGames;
        setGames(liveGames);
      }
      setGamesLoading(false);
      const saved=localStorage.getItem('dd_me');
      if(saved){setMe(JSON.parse(saved));setScreen('home');}
      else setScreen('onboard');
    };
    init();
  },[]);
  useEffect(()=>{
    if(!me)return; let cancelled=false;
    const poll=async()=>{
      if(cancelled)return;
      const fl=JSON.parse(localStorage.getItem('dd_friends')||'[]');
      const profiles=await Promise.all(fl.map(id=>sget(`user:${id}`)));
      if(!cancelled)setFriends(profiles.filter(Boolean));
      const incoming=(await sget(`challenges:${me.id}`))||[];
      const sent=(await sget(`challenges_sent:${me.id}`))||[];
      const prevIncoming=challenges.filter(c=>c.dir==='in'&&c.status==='pending');
      const newIncoming=incoming.filter(c=>c.status==='pending'&&!prevIncoming.find(p=>p.duelId===c.duelId));
      newIncoming.forEach(c=>notify('⚔️ Challenge Received!',`${c.challengerName} challenged you to a duel`));
      if(!cancelled)setChallenges([...incoming.map(c=>({...c,dir:'in'})),...sent.map(c=>({...c,dir:'out'}))]);
      if(activeDuelId.current){const fresh=await sget(`duel:${activeDuelId.current}`);if(fresh&&!cancelled)setActiveDuel(fresh);}
    };
    poll(); const id=setInterval(poll,5000);
    const checkLineups=async()=>{
      const watch=(await sget('lineup_watch'))||[];
      if(!watch.length)return;
      const stillWaiting=[];
      for(const item of watch){
        const gamePk=item.gameId.replace('mlb_','');
        if(isNaN(Number(gamePk))){stillWaiting.push(item);continue;}
        const lineups=await fetchLineupsForGame(gamePk);
        if(lineups){
          for(const userId of[item.challengerId,item.opponentId]){
            const inbox=(await sget(`challenges:${userId}`))||[];
            const updated=inbox.map(c=>c.duelId===item.duelId?{...c,status:'pending',lineupReady:true,...lineups}:c);
            await sset(`challenges:${userId}`,updated);
            const sent=(await sget(`challenges_sent:${userId}`))||[];
            const updatedSent=sent.map(c=>c.duelId===item.duelId?{...c,status:'pending',lineupReady:true,...lineups}:c);
            await sset(`challenges_sent:${userId}`,updatedSent);
          }
          GAMES=GAMES.map(g=>g.id===item.gameId?{...g,...lineups}:g);
          setGames(prev=>prev.map(g=>g.id===item.gameId?{...g,...lineups}:g));
          showToast('⚾ Lineups are in! Time to draft.');
          refresh();
        } else {
          stillWaiting.push(item);
        }
      }
      await sset('lineup_watch',stillWaiting);
    };
    const lineupId=setInterval(checkLineups,3*60*1000);
    checkLineups();
    return()=>{cancelled=true;clearInterval(id);clearInterval(lineupId);};
  },[me,tick]);
  const openDuel=useCallback(async(duelId)=>{
    const d=await sget(`duel:${duelId}`);
    if(d){activeDuelId.current=duelId;setActiveDuel(d);setScreen('duel');}
  },[]);
  const handleSetActiveDuel=useCallback((d)=>{if(d)activeDuelId.current=d.id;setActiveDuel(d);},[]);
  const refreshMe=useCallback(async()=>{const fresh=await sget(`user:${me.id}`);if(fresh){localStorage.setItem('dd_me',JSON.stringify(fresh));setMe(fresh);}},[me]);
  const handleOnboardComplete=useCallback(async(p)=>{
    localStorage.setItem('dd_me',JSON.stringify(p)); setMe(p); sset(`user:${p.id}`,p);
    const idx=(await sget('code_index'))||{};
    idx[p.joinCode]=p.id; sset('code_index',idx);
    setScreen('home');
  },[]);
  const buildDemoDuel=useCallback((myProfile,gameId,draftMode,scoring,coinWinner)=>{
    const bot={id:'bot_demo',name:'Demo Bot 🤖',avatar:'🤖',color:'#c084fc',joinCode:'DEMO0',wins:3,losses:2,ties:0,games:5,totalPts:142};
    const gameList=GAMES.length>0?GAMES:FALLBACK_GAMES;
    const game=gameList.find(g=>g.id===gameId)||gameList[0];
    const r1slots=buildSlotsForRound(game,1); const r1order=buildOrder(coinWinner,r1slots,draftMode);
    const duelId='duel_demo_'+Date.now();
    const duel={id:duelId,challengerId:myProfile.id,opponentId:bot.id,challengerName:myProfile.name,opponentName:bot.name,gameId:game.id,draftMode,scoring,slots:r1slots,order:r1order,pickIdx:0,assignments:{},takenIds:[],picks:{challenger:[],opponent:[]},pickLog:[],status:'drafting',draftRound:1,firstPick:coinWinner,r2firstPick:null};
    return{bot,duel};
  },[]);
  const launchDemoWithSettings=useCallback((gameId,draftMode,scoring,coinWinner)=>{
    if(!me)return;
    const{bot,duel}=buildDemoDuel(me,gameId,draftMode,scoring,coinWinner);
    sset(`user:${bot.id}`,bot); sset(`duel:${duel.id}`,duel);
    localStorage.setItem('dd_friends',JSON.stringify([bot.id]));
    activeDuelId.current=duel.id; setFriends([bot]); setActiveDuel(duel); setScreen('duel');
  },[me,buildDemoDuel]);
  const launchDemoFromHome=useCallback(()=>{
    if(!me)return;
    if(gamesLoading){showToast('Loading today\'s games…');return;}
    const bot={id:'bot_demo',name:'Demo Bot 🤖',avatar:'🤖',color:'#c084fc',joinCode:'DEMO0',wins:3,losses:2,ties:0,games:5,totalPts:142};
    sset(`user:${bot.id}`,bot);
    localStorage.setItem('dd_friends',JSON.stringify([bot.id]));
    setFriends([bot]); setScreen('challenge-demo');
  },[me,gamesLoading,showToast]);
  const Toast=({msg})=>(<div style={{position:'fixed',bottom:24,left:'50%',transform:'translateX(-50%)',background:'#1c2630',border:'1px solid #2a3540',borderRadius:8,padding:'10px 18px',fontFamily:'monospace',fontSize:12,color:'#e8edf2',zIndex:999,whiteSpace:'nowrap',boxShadow:'0 4px 20px rgba(0,0,0,.4)'}}>{msg}</div>);
  const [activeSeries,setActiveSeries]=useState([]);
  const [currentSeries,setCurrentSeries]=useState(null);
  useEffect(()=>{
    if(!me)return;
    const loadSeries=async()=>{
      const sent=(await sget(`series_sent:${me.id}`))||[];
      const inbox=(await sget(`series_inbox:${me.id}`))||[];
      const allIds=[...new Set([...sent.map(s=>s.id),...inbox.map(s=>s.id)])];
      const fresh=await Promise.all(allIds.map(id=>sget(`series:${id}`)));
      const merged=allIds.map((id,i)=>{
        if(fresh[i])return fresh[i];
        return sent.find(s=>s.id===id)||inbox.find(s=>s.id===id);
      }).filter(Boolean);
      setActiveSeries(merged);
    };
    loadSeries();
  },[me,tick]);
  const openSeries=useCallback(async(seriesId)=>{
    const s=await sget(`series:${seriesId}`);
    if(s){setCurrentSeries(s);setScreen('series');return;}
    const fallback=activeSeries.find(x=>x.id===seriesId);
    if(fallback){setCurrentSeries(fallback);setScreen('series');}
  },[activeSeries]);
  const commonProps={onNav:setScreen,showToast,refresh,games,gamesLoading};
  return(<div>
    {screen==='loading'&&<LoadingScreen gamesLoading={gamesLoading}/>}
    {screen==='onboard'&&<OnboardScreen onComplete={handleOnboardComplete}/>}
    {screen==='home'&&me&&<HomeScreen me={me} friends={friends} challenges={challenges} onOpenDuel={openDuel} onDemo={launchDemoFromHome} onLogout={()=>{localStorage.clear();setMe(null);setScreen('onboard');}} onOpenSeries={openSeries} activeSeries={activeSeries} {...commonProps}/>}
    {screen==='friends'&&me&&<FriendsScreen me={me} friends={friends} {...commonProps}/>}
    {screen==='challenge'&&me&&<ChallengeScreen me={me} friends={friends} setActiveDuel={handleSetActiveDuel} isDemo={false} onLaunchDemo={null} onDemo={launchDemoFromHome} {...commonProps}/>}
    {screen==='challenge-demo'&&me&&<ChallengeScreen me={me} friends={friends} setActiveDuel={handleSetActiveDuel} isDemo={true} onLaunchDemo={launchDemoWithSettings} {...commonProps}/>}
    {screen==='challenge-series'&&me&&<SeriesChallengeScreen me={me} friends={friends} onDemo={launchDemoFromHome} {...commonProps}/>}
    {screen==='series'&&me&&currentSeries&&<SeriesScreen series={currentSeries} me={me} friends={friends} onOpenDuel={openDuel} setActiveDuel={handleSetActiveDuel} {...commonProps}/>}
    {screen==='duel'&&me&&<DuelScreen duel={activeDuel} me={me} setActiveDuel={handleSetActiveDuel} refreshMe={refreshMe} games={games} {...commonProps}/>}
    {screen==='h2h'&&me&&<H2HScreen me={me} friends={friends} {...commonProps}/>}
    {toastMsg&&<Toast msg={toastMsg}/>}
  </div>);
}

export default App;
