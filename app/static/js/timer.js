/* Javascript Object Oriented Timer, version 1.0
 * --------------------------------------------------------
 * Copyright (C) 2008 zp bappi | zpbappi (at) gmail (dot) com
 *
 * Details and latest version at:
 * http://abcoder.com/javascript/core_javascript/javascript_timer
 *
 *
 * This script is distributed under the GNU Lesser General Public License (Version 3, 29 June 2007 or later).
 *
 * ================================ IMPORTANT ===========================================
 * This library is free software; you can redistribute it and/or modify it under the terms
 * of the GNU Lesser General Public License as published by the Free Software Foundation; 
 * either version 2.1 of the License, or (at your option) any later version.

 * This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Lesser General Public License for more details.
 * =======================================================================================
 *
 * Read the entire license text here: http://www.gnu.org/licenses/lgpl.html
 */
 
 
/* just declaring the class and pointing the real constructor */
var Timer = function(millis, callback){
  return this._init(millis, callback);
}

Timer.prototype = {
  //*******************************************************
  //Private Block starts here *****************************
  //
  //funcations and variables listed bellow
  //should not be accessed from outside
  //*******************************************************
  VERSION: 1.0,
  
  /* constructor for Timer object */
  _init: function(millis, callback){
    
    /* private variables */
    this._interval = 1000;
    this._timer = null;
    this._cbs = [];
    this._multipliers = [];
    this._tickCounts = [];
    this._canRun = [];
    this._stoppedThreads = 0;
    this._runOnce = false;
    this._startedAt = -1;
    this._pausedAt = -1;
    
    if(typeof(millis)=='number') this._interval = millis;
    
    this.addCallback(callback);
    
    return this;
  },
  
  
  /* some preset operation, called from start() */
  _preset: function(){
    this._stoppedThreads = 0;
    this._startedAt = -1;
    this._pausedAt = -1;
    for(var i=0; i<this._cbs.length; i++){
      this._canRun[i] = true;
      this._tickCounts[i] = 0;
    }
  },
  
  
  /* private clock pulse handler */
  /* The kernel */
  // this method actually makes things work
  _ticks: function(initInterval){
    
    /* process callback here */
    var me = this;
    for(var i=0; i<this._cbs.length; i++){
      if(typeof(this._cbs[i])=='function' && this._canRun[i]){
        this._tickCounts[i]++;
        if(this._tickCounts[i] == this._multipliers[i]){
          this._tickCounts[i] = 0;
          
          if(this.runOnce()){
            //in runOnce(true) mode, none is allowed to run more once
            this._canRun[i] = false;
            
            //count number of callback operations finished
            this._stoppedThreads++;
          }
          
          /* actually executing callback functions here */
          // trying to achieve parallelism for each function
          window.setTimeout(me._cbs[i], 0);
        }
      }
    }
    
    /* detect ending pulse for runOnce(true) mode */
    //all callback functions must be called exactly once when running in runOnce(true) mode
    if(this.runOnce() && this._stoppedThreads == this._cbs.length)
      this.stop();
    
    
    /* resume logic */
    if(typeof(initInterval)=='number'){
      //when resuming, after the first pulse, 
      //start clock with assigned interval and without presetting
      this.stop().start(null, true);
    }
  },
  
  //**********************************************************************
  // Private block ends here *********************************************
  //**********************************************************************
  // bellow is public block, i.e., listed function are available to use.
  // further detail about functions can be found just above the function 
  //**********************************************************************
  
  
  
  
  /* get/set mode of running */
  //Parameters:
  //  isRunOnce(optional)->   accepts true or false for setting the mode. default is false.
  //              if false, then timer runs untill each callback executes exactly once.
  //              if true, then timer runs forever until stop() or pause() is called.
  //              also, calling runOnce() without parameter returns the current mode of timer (true or false)
  //Returns: current Timer object(this) or boolean specifying current mode.
  
  runOnce: function(isRunOnce){
    if(typeof(isRunOnce)=='undefined') return this._runOnce;
    else if(typeof(isRunOnce)=='boolean') this._runOnce = isRunOnce;
    else alert("Invalid argument for runOnce(...).\n\nUsage: runOnce(true | false) /*Default value: false*/\nor, runOnce() to get status");
    return this;
  },
  
  
  /* get/set timer clock interval in milli sec */
  //Parameters:
  //  millis(optional)->  accepts integer number only. default is 1000 (1 sec).
  //            also, calling runOnce() without parameter returns the current interval of timer in milli sec
  //            using any other variation will have no effect, you may try...
  //Returns: current Timer object(this) or integer specifying current interval of the timer
  
  interval: function(millis){
    if(typeof(millis)=='undefined') return this._interval;
    else if(typeof(millis)=='number') this._interval = Math.floor(millis);
    return this;
  },
  
  
  /* stops the timer */
  //Returns: current Timer object(this)
  //CAUTION: DO NOT pass any patameter when using stop. this may have the same destructive effect (or a little less) described for start method.
  
  stop: function(isPausing){
    if(this._timer){
      if(!isPausing) this._pausedAt = -1;
      try{
        window.clearInterval(this._timer);
      }
      catch(ex){
        //i dont know if this line will be executed ever...
      }
      this._timer = null;
    }
    return this;
  },
  
  
  /* checks if timer is stopped */
  //Returns:  true if timer is stopped, false otherwise
  //Note:   paused and stopped are different states
  
  isStopped: function(){
    return ((this._timer == null) && !this.isPaused());
  },
  
  
  /* starts the timer */
  //DO NOT pass the parameters when using the timer. these parameters are for internal use only.
  //just use start(). this works fine :)
  //CAUTION:  passing the parameters may cause you diarrhoea or reveal your secret credentials in
  //      world wide web or have significant desructive effect on your browser!
  //      the outcome is unpredictable in nature.
  //Returns:  current Timer object(this)
  
  start: function(_initialInterval, _withoutPreset){
    //when timer is paused, calling start behaves same as calling resume
    //but i do not recomment it
    //use resume when timer is paused
    if(this.isPaused())
      return this.resume();
    
    //prevent unnecessary calls to start
    if(!this.isStopped())
      return this;
    
    //when resuming, after one pulse, start is called to restore default default attitude of the timer.
    //hence, preset is not to be called
    if(!_withoutPreset)
      this._preset();
    
    var tmpInterval = this._interval;

    
    //when resuming, before the very first pulse,
    //start is called from resume with calculated interval
    //to behave like actually what resume means.
    //in all other cases, it is undefined or null
    if(typeof(_initialInterval)=='number') tmpInterval = _initialInterval;
    
    //what is this?
    //this is me.
    var me = this;
    
    
    //initializing the timer
    //looks familiar, eh!
    this._timer = window.setInterval(function(){me._ticks(_initialInterval);}, tmpInterval);

    //keeps track when the timer starts
    this._startedAt = (new Date()).getTime();
    //needed when resume() then pause() then again resume() is called
    //just track back one step before
    this._startedAt -= (this._interval - tmpInterval);
    return this;
  },
  
  
  
  /* pauses the timer, i.e., freezes execution */
  //it actually works like freezing the timer, dont be fooled by the code.
  //Returns:  current Timer object(this)
  
  pause: function(){
    if(this._timer){
      this._pausedAt = (new Date()).getTime();
      this.stop(true);
    }
    return this;
  },
  
  
  /* checks if timer is paused */
  //Returns:  true if timer is paused, false otherwise.
  //Note:   paused and stopped are different stages
  
  isPaused: function(){
    return (this._pausedAt >= 0); 
  },
  
  
  /* resumes the timer from paused state */
  //if timer is paused, it is resumed from the state it was (before pause)
  //if timer was not paused, it has no effect
  //Returns:  current Timer object(this)
  
  resume: function(){
    if(this.isPaused()){
      var tempInterval = this._interval - ((this._pausedAt - this._startedAt)%this._interval);
      this._pausedAt = -1;
      this.start(tempInterval, true);
    }
    return this;
  },
  
  
  /* restarts the timer */
  //just a shortcut for stop() and then start()
  //Returns:  current Timer object(this)
  restart: function(){
    return this.stop().start();
  },
  
  
  /* adds a callback function to be called */
  //Parameters:
  //  callback(mandatory)->   accepts only a function to be called at each Nth pulse of timer clock
  //              if not a function, the call to this function has no effect.
  //  N(optional)->     accept only integer value (takes floor if floating number is passed). default value is 1.
  //              calls the callback function at each Nth pulsh of the timer clock.
  //Returns: current Timer object(this)
  
  addCallback: function(callback, N){
    if(typeof(callback)=='function'){
      this._cbs.push(callback);
      if(typeof(N)=='number'){
        N = Math.floor(N)
        this._multipliers.push((N < 1 ? 1 : N));
      }
      else
        this._multipliers.push(1);
      
      this._tickCounts.push(0);
      this._canRun.push(true);
    }
    return this;
  },
  
  
  /* removes all callback functions added previously */
  //Returns: current Timer object(this)
  
  clearCallbacks: function(){
    this._cbs.length = 0;
    this._multipliers.length = 0;
    this._canRun.length = 0;
    this._tickCounts.length = 0;
    this._stoppedThreads = 0;
    return this;
  }
};