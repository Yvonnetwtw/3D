// Original synthesized melody. No audio downloads or microphone access.
export function createAudio({announce,getIntroduction}){
 const musicButton=document.querySelector('#musicToggle'),voiceButton=document.querySelector('#voiceToggle'),replay=document.querySelector('#voiceReplay'),volume=document.querySelector('#audioVolume'),note=document.querySelector('#audioNote');
 let context,master,timer,musicOn=false,voiceOn=false,level=.4,step=0,speech=null,speechBusy=false,speechTimer=null;
 const synth='speechSynthesis' in window?window.speechSynthesis:null;
 const update=()=>{musicButton.setAttribute('aria-pressed',String(musicOn));musicButton.textContent=`♫ 背景音樂：${musicOn?'開':'關'}`;voiceButton.setAttribute('aria-pressed',String(voiceOn));voiceButton.textContent=`◉ 語音導覽：${voiceOn?'開':'關'}`;replay.disabled=!voiceOn;};
 function gain(){if(context&&master)master.gain.setTargetAtTime((speechBusy?.28:1)*level,context.currentTime,.12);}
 function stopSpeech(){clearTimeout(speechTimer);if(synth)synth.cancel();speech=null;speechBusy=false;gain();}
 function speak(text){if(!voiceOn||!synth||document.hidden)return;stopSpeech();const utterance=new SpeechSynthesisUtterance(text);speech=utterance;utterance.lang='zh-TW';utterance.rate=.92;utterance.volume=level;const voices=synth.getVoices();const voice=voices.find(v=>/^zh[-_]TW$/i.test(v.lang))||voices.find(v=>/^zh[-_]Hant/i.test(v.lang))||voices.find(v=>/^zh/i.test(v.lang));if(voice)utterance.voice=voice;
 utterance.onstart=()=>{if(speech!==utterance)return;clearTimeout(speechTimer);speechTimer=setTimeout(()=>{stopSpeech();note.textContent='朗讀已停止，可按重聽再試一次。';},90000);speechBusy=true;gain();note.textContent='正在朗讀 · 音樂會自動降低音量';};
 const end=()=>{if(speech!==utterance)return;clearTimeout(speechTimer);speechBusy=false;speech=null;gain();note.textContent='點選建築聽介紹；可隨時關閉聲音。';};
 utterance.onend=end;utterance.onerror=e=>{if(speech!==utterance)return;end();if(!['canceled','interrupted'].includes(e.error)){voiceOn=false;update();note.textContent='目前系統無法播放中文語音，請確認裝置有可用的中文語音。';announce(note.textContent);}};
 speechTimer=setTimeout(()=>{if(speech!==utterance||speechBusy)return;stopSpeech();voiceOn=false;update();note.textContent='語音服務未能啟動，請確認裝置的中文語音設定。';announce(note.textContent);},10000);synth.speak(utterance);
 }
 const melody=[0,7,12,7,4,9,12,9,5,12,16,12,7,14,19,14];
 function tone(freq,time,length,strength){const osc=context.createOscillator(),env=context.createGain();osc.type='sine';osc.frequency.value=freq;env.gain.setValueAtTime(0,time);env.gain.linearRampToValueAtTime(strength,time+.09);env.gain.exponentialRampToValueAtTime(.0001,time+length);osc.connect(env);env.connect(master);osc.start(time);osc.stop(time+length+.05);osc.onended=()=>{osc.disconnect();env.disconnect();};}
 function schedule(){if(!musicOn||context.state!=='running')return;const t=context.currentTime+.06,base=step%32<16?220:196,n=melody[step%melody.length];tone(base*Math.pow(2,n/12),t,1.6,.065);if(step%4===0){tone(base/2,t,3.2,.055);tone(base*.75,t,3.2,.025);}step++;}
 async function setMusic(on){try{if(on){const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext)throw new Error('unsupported');if(!context){context=new AudioContext();master=context.createGain();master.connect(context.destination);}await context.resume();musicOn=true;gain();schedule();clearInterval(timer);timer=setInterval(schedule,650);note.textContent='原創合成背景音樂 · 可搭配語音導覽';}else{musicOn=false;clearInterval(timer);timer=null;if(context)await context.suspend();note.textContent='背景音樂已關閉。';}update();}catch{musicOn=false;clearInterval(timer);update();note.textContent='此瀏覽器無法播放背景音樂。';announce(note.textContent);}}
 musicButton.addEventListener('click',async()=>{musicButton.disabled=true;try{await setMusic(!musicOn);}finally{musicButton.disabled=false;}});
 voiceButton.addEventListener('click',()=>{voiceOn=!voiceOn;update();if(voiceOn){speak(getIntroduction());note.textContent='使用裝置的中文語音；不需要麥克風。';}else{stopSpeech();note.textContent='語音已關閉。';}announce(`語音導覽${voiceOn?'已開啟':'已關閉'}`);});
 replay.addEventListener('click',()=>speak(getIntroduction()));
 volume.addEventListener('input',()=>{level=Number(volume.value)/100;document.querySelector('#volumeValue').textContent=volume.value+'%';gain();if(speech)note.textContent='語音音量會在下一段朗讀生效。';});
 if(!synth){voiceButton.disabled=true;note.textContent='此瀏覽器不支援語音朗讀；仍可使用音樂與文字介紹。';}
 document.addEventListener('visibilitychange',()=>{if(document.hidden){stopSpeech();if(context&&musicOn)context.suspend().catch(()=>{});}else if(context&&musicOn){context.resume().catch(()=>{});}});
 window.addEventListener('pagehide',()=>{clearInterval(timer);stopSpeech();if(context)context.close().catch(()=>{});});
 update();return {speak,stopSpeech,isSpeaking:()=>voiceOn&&!!synth&&(speechBusy||synth.speaking||synth.pending)};
}
