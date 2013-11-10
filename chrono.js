    var seconds = 0;
    var minutes = 0;



    function chrono()
    {
        if(starttime == 1)
        {

            if(minutes<10 && seconds<10){
            document.getElementById('chrono').innerHTML = '0' + minutes + ':0'+ seconds;
            }
            else if(minutes<10 && seconds>=10){
                document.getElementById('chrono').innerHTML = '0' + minutes + ':'+ seconds;
            }
            else if(minutes>=10 && seconds<10){
                document.getElementById('chrono').innerHTML = minutes + ':0'+ seconds;
            }
            else {
                document.getElementById('chrono').innerHTML = minutes + ':'+ seconds;
            }

            if(seconds == 59){
                seconds = 0;
                minutes+=1;
            }
            else{
                seconds+=1;
            }
            setTimeout("chrono()", 1000);
        }
    }

