<?php
function enviarCorreoConfirmacion($correo, $nombres) {
    $url = 'http://localhost:3001/send'; 

    $data = [
        'to' => $correo,
        'subject' => '¡Bienvenido a Habla Food!',
        'text' => "Hola $nombres, gracias por registrarte en Habla Food."
    ];

    $jsonData = json_encode($data);

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Content-Length: ' . strlen($jsonData)
    ]);

    $response = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return $status === 200;
}
