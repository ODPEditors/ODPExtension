(function()
{

		//sets debuging on/off for this JavaScript file

			this.scratchPadSave = function(dontSaveToHistory)
			{
				var value = this.scratchPad.getElementById('ODPExtension-sratchpad').value;

				if(!dontSaveToHistory && this.shared.scratch.history[this.shared.scratch.history.length-1] != value)
					this.shared.scratch.history[this.shared.scratch.history.length] = value;

				this.preferenceSet('scratch.pad', value);
				this.notifyOtherInstances('scratchPadUpdate');
			}

			this.scratchPadUpdate = function()
			{
				if(this.scratchPad)
					this.scratchPad.getElementById('ODPExtension-sratchpad').value = this.preferenceGet('scratch.pad');
			}

			this.scratchPadPanic = function()
			{
				if(this.shared.scratch.counter === null)
				{
					this.shared.scratch.counter = this.shared.scratch.history.length;
					this.notifyOnce('Every time you press this button the content of the textfield will try to go one step back', 'scratchPadPanic');
				}

				this.shared.scratch.counter--;

				if(this.shared.scratch.history[this.shared.scratch.counter])
				{
					this.scratchPad.getElementById('ODPExtension-sratchpad').value = this.shared.scratch.history[this.shared.scratch.counter];
					this.scratchPadSave(true);
				}
				else
				{
					if(this.confirm('We have reached the end. Do you want to start again?'))
					{
						this.shared.scratch.counter = this.shared.scratch.history.length;
						this.scratchPadPanic();
					}
				}
			}
	return null;

}).apply(ODPExtension);
