
function send_data(url,data = null,methods="GET",successfully_processed= (data) => {},error_processed= (data) => {},header={},){
    fetch(url,
    {
            method: methods,
            body: data,
            headers:header
            })
           .then(response => response.json())
           .then(data => {
                if (data.success) {
                    successfully_processed(data)
                } else {
                    error_processed(data);
                }
            })
}

function register(event){
    let form_data =  document.getElementById('form_register');
    let formData = new FormData(form_data);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm-password');
    if(password!==confirmPassword){
        alert("两次密码不一致,请出现输入！")
        return false
    }
    send_data(
        "/register",
        formData,
        'POST',
        function (data){window.window.location.href = data.redirect_url;},
        function (data){alert(data.error)},

    )
    return false
}
function forget_password(){
     let form_data =  document.getElementById('forget_password_form');
    let formData = new FormData(form_data);
    const password = formData.get('new-password');
    const confirmPassword = formData.get('confirm-new-password');
    if(password!==confirmPassword){
        alert("两次密码不一致,请出现输入！")
        return false
    }
    send_data(
        "/forgot_password",
        formData,
        'POST',
        function (data){window.window.location.href = data.redirect_url;},
        function (data){
            alert(data.error)
        }
    );

    return false
}

function inint_light(data){
    data = JSON.parse(data.device)
     let lightBulb = document.getElementById('light-bulb');
    let brightnessInput = document.getElementById('brightness');
    let redInput = document.getElementById('red');
    let greenInput = document.getElementById('green');
    let blueInput = document.getElementById('blue');
    let rgb = JSON.parse(data.setting).RGB
    let lightStatus = document.getElementById('lightStatus');
    lightStatus.textContent = data.status
     if(data.status === "Off"){
          isLightOn = false
     }else {
          isLightOn = true;
     }
     [brightnessInput, redInput, greenInput, blueInput].forEach(input => {
                input.disabled = !isLightOn;
            })
     lightBulb.classList.toggle('off', !isLightOn);
     brightnessInput.value = data.brightness
     redInput.value = rgb[0]
     greenInput.value = rgb[1]
     blueInput.value = rgb[2]
     redValue.textContent = redInput.value;
    greenValue.textContent = greenInput.value;
    blueValue.textContent = blueInput.value;
    const r = redInput.value, g = greenInput.value, b = blueInput.value;
    const brightness = brightnessInput.value / 100;
    lightBulb.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${brightness})`;
    lightBulb.style.boxShadow = `0 0 ${brightness * 20}px rgba(${r}, ${g}, ${b}, ${brightness})`;
}

function  init_curtain(data){
    data = JSON.parse(data.device)
    let leftCurtain = document.getElementById('left-curtain');
    let rightCurtain = document.getElementById('right-curtain');
    let leftCurtainRange = document.getElementById('leftCurtainRange');
    let rightCurtainRange = document.getElementById('rightCurtainRange');
    let leftCurtainStatus = document.getElementById('leftCurtainStatus');
    let rightCurtainStatus = document.getElementById('rightCurtainStatus');
    leftCurtainRange.value = JSON.parse(data.setting).curtain[0]
    rightCurtainRange.value = JSON.parse(data.setting).curtain[1]
    leftCurtain.style.width = `${leftCurtainRange.value}%`;
    leftCurtainStatus.textContent = leftCurtainRange.value === '0' ? 'Open' : 'Closed';
     rightCurtain.style.width = `${rightCurtainRange.value}%`;
     rightCurtainStatus.textContent = rightCurtainRange.value === '0' ? 'Open' : 'Closed';
}

function init_ac(data){
    data = JSON.parse(data.device);
    let acDial = document.getElementById('ac-dial');
    let acTempDisplay = document.getElementById('acTempDisplay');
    let tempInput = document.getElementById('temperature');
    let modeSelect = document.getElementById('modeSelect');
    let acModeDisplay = document.getElementById('acModeDisplay');
    let tempDisplay = document.getElementById('tempDisplay');
     isAcOn = false;

    tempInput.value = data.temperature;
     if(data.status === 'off'){
         isAcOn = false
     }else {
         isAcOn = true;
     }
    acDial.classList.toggle('off', !isAcOn);
    acTempDisplay.style.display = isAcOn ? 'block' : 'none';
    tempInput.disabled = !isAcOn;
    tempDisplay.textContent = tempInput.value;
    modeSelect.value = JSON.parse(data.setting).mode;
    acTempDisplay.textContent = `${tempInput.value}°C`;
    acModeDisplay.textContent = modeSelect.value.charAt(0).toUpperCase() + modeSelect.value.slice(1);
}

function init_rangehood(data){
    data = JSON.parse(data.device);
    let hoodStatus = document.getElementById('hoodStatus');
    let fanSpeedInput = document.getElementById('fanSpeed');
    let fanSpeedValue = document.getElementById('fanSpeedValue');
    if (data.status === "Off"){
        isHoodOn = false
    }else{
        isHoodOn = true
    }
    hoodStatus.textContent = data.status
    fanSpeedInput.disabled = !isHoodOn;
    fanSpeedInput.value = JSON.parse(data.setting).Fan_speed
    fanSpeedValue.textContent = fanSpeedInput.value

}

function send_light_data(room_id){
    let brightnessInput = document.getElementById('brightness');
    let redInput = document.getElementById('red');
    let greenInput = document.getElementById('green');
    let blueInput = document.getElementById('blue');
    let lightStatus = document.getElementById('lightStatus');
    let new_data = {
        brightness:brightnessInput.value,
        status:lightStatus.textContent,
        setting:{RGB:[redInput.value,greenInput.value,blueInput.value]}
    }
    send_data(
         "/set_device",
         JSON.stringify({room_id:room_id, device_type_id:1,data:new_data}),
         "POST",
         function (){console.log(room_id,"已保存数据",new_data)},
         function (data){
             alert(data.error)
         },
         {'Content-Type': 'application/json'}
     )
}

function send_curtain_data(room_id){
    let leftCurtainRange = document.getElementById('leftCurtainRange');
    let rightCurtainRange = document.getElementById('rightCurtainRange');
    let new_data = {
        setting:{curtain:[leftCurtainRange.value,rightCurtainRange.value]}
    }
    send_data(
         "/set_device",
         JSON.stringify({room_id:room_id, device_type_id:2,data:new_data}),
         "POST",
         function (){console.log(room_id,"已保存数据",new_data)},
         function (data){
             alert(data.error)
         },
         {'Content-Type': 'application/json'}
     )
}

function send_ac_data(room_id){
    let tempInput = document.getElementById('temperature');
    let modeSelect = document.getElementById('modeSelect');
    let new_data = {
        status: isAcOn ? "on" : "off",
        temperature:tempInput.value,
        setting:{mode:modeSelect.value}
    }

    send_data(
         "/set_device",
         JSON.stringify({room_id:room_id, device_type_id:3,data:new_data}),
         "POST",
         function (){console.log(room_id,"已保存数据",new_data)},
         function (data){
             alert(data.error)
         },
         {'Content-Type': 'application/json'}
     )
}

function send_rangehood_data(room_id){
    let hoodStatus = document.getElementById('hoodStatus');
    let fanSpeedInput = document.getElementById('fanSpeed');
    let new_data = {
        status: hoodStatus.textContent,
        setting:{Fan_speed:fanSpeedInput.value}
    }

    send_data(
         "/set_device",
         JSON.stringify({room_id:room_id, device_type_id:4,data:new_data}),
         "POST",
         function (){console.log(room_id,"已保存数据",new_data)},
         function (data){
             alert(data.error)
         },
         {'Content-Type': 'application/json'}
     )
}