
// aes_gcm_vectors.js

// The following function returns an array of test vectors
// for the subtleCrypto encrypt method.
//
// Each test vector has the following fields:
//     name - a unique name for this vector
//     keyBuffer - an arrayBuffer with the key data in raw form
//     key - a CryptoKey object for the keyBuffer. INITIALLY null! You must fill this in first to use it!
//     algorithm - the value of the AlgorithmIdentifier parameter to provide to encrypt
//     plaintext - the text to encrypt
//     result - the expected result (usually just ciphertext, sometimes with added authentication)
function getTestVectors() {
    // Before we can really start, we need to fill a bunch of buffers with data
    var plaintext = new Uint8Array([84, 104, 105, 115, 32, 115,
        112, 101, 99, 105, 102, 105, 99, 97, 116, 105, 111, 110,
        32, 100, 101, 115, 99, 114, 105, 98, 101, 115, 32, 97, 32,
        74, 97, 118, 97, 83, 99, 114, 105, 112, 116, 32, 65, 80,
        73, 32, 102, 111, 114, 32, 112, 101, 114, 102, 111, 114,
        109, 105, 110, 103, 32, 98, 97, 115, 105, 99, 32, 99, 114,
        121, 112, 116, 111, 103, 114, 97, 112, 104, 105, 99, 32,
        111, 112, 101, 114, 97, 116, 105, 111, 110, 115, 32, 105,
        110, 32, 119, 101, 98, 32, 97, 112, 112, 108, 105, 99, 97,
        116, 105, 111, 110, 115, 44, 32, 115, 117, 99, 104, 32, 97,
        115, 32, 104, 97, 115, 104, 105, 110, 103, 44, 32, 115,
        105, 103, 110, 97, 116, 117, 114, 101, 32, 103, 101, 110,
        101, 114, 97, 116, 105, 111, 110, 32, 97, 110, 100, 32,
        118, 101, 114, 105, 102, 105, 99, 97, 116, 105, 111, 110,
        44, 32, 97, 110, 100, 32, 101, 110, 99, 114, 121, 112,
        116, 105, 111, 110, 32, 97, 110, 100, 32, 100, 101, 99,
        114, 121, 112, 116, 105, 111, 110, 46, 32, 65, 100, 100,
        105, 116, 105, 111, 110, 97, 108, 108, 121, 44, 32, 105,
        116, 32, 100, 101, 115, 99, 114, 105, 98, 101, 115, 32, 97,
        110, 32, 65, 80, 73, 32, 102, 111, 114, 32, 97, 112, 112,
        108, 105, 99, 97, 116, 105, 111, 110, 115, 32, 116, 111,
        32, 103, 101, 110, 101, 114, 97, 116, 101, 32, 97, 110,
        100, 47, 111, 114, 32, 109, 97, 110, 97, 103, 101, 32, 116,
        104, 101, 32, 107, 101, 121, 105, 110, 103, 32, 109, 97,
        116, 101, 114, 105, 97, 108, 32, 110, 101, 99, 101, 115,
        115, 97, 114, 121, 32, 116, 111, 32, 112, 101, 114, 102,
        111, 114, 109, 32, 116, 104, 101, 115, 101, 32, 111, 112,
        101, 114, 97, 116, 105, 111, 110, 115, 46, 32, 85, 115,
        101, 115, 32, 102, 111, 114, 32, 116, 104, 105, 115, 32,
        65, 80, 73, 32, 114, 97, 110, 103, 101, 32, 102, 114, 111,
        109, 32, 117, 115, 101, 114, 32, 111, 114, 32, 115, 101,
        114, 118, 105, 99, 101, 32, 97, 117, 116, 104, 101, 110,
        116, 105, 99, 97, 116, 105, 111, 110, 44, 32, 100, 111,
        99, 117, 109, 101, 110, 116, 32, 111, 114, 32, 99, 111,
        100, 101, 32, 115, 105, 103, 110, 105, 110, 103, 44, 32,
        97, 110, 100, 32, 116, 104, 101, 32, 99, 111, 110, 102,
        105, 100, 101, 110, 116, 105, 97, 108, 105, 116, 121, 32,
        97, 110, 100, 32, 105, 110, 116, 101, 103, 114, 105, 116,
        121, 32, 111, 102, 32, 99, 111, 109, 109, 117, 110, 105,
        99, 97, 116, 105, 111, 110, 115, 46]);

    // We want some random key bytes of various sizes.
    // These were randomly generated from a script.
    var keyBytes = {
        128: new Uint8Array([222, 192, 212, 252, 191, 60, 71,
            65, 200, 146, 218, 189, 28, 212, 192, 78]),
        192: new Uint8Array([208, 238, 131, 65, 63, 68, 196, 63, 186, 208,
            61, 207, 166, 18, 99, 152, 29, 109, 221, 95, 240, 30, 28, 246]),
        256: new Uint8Array([103, 105, 56, 35, 251, 29, 88, 7, 63, 145, 236,
            233, 204, 58, 249, 16, 229, 83, 38, 22, 164, 210, 123, 19, 235, 123, 116,
            216, 0, 11, 191, 48])
    }

    // AES-GCM needs an IV of no more than 2^64 - 1 bytes. Well, 32 bytes is okay then.
    var iv = new Uint8Array([58, 146, 115, 42, 166, 234, 57,
        191, 57, 134, 224, 199, 63, 169, 32, 0, 32, 33, 117, 56,
        94, 248, 173, 234, 194, 200, 115, 53, 235, 146, 141, 212]);

    // Authenticated encryption via AES-GCM requires additional data that
    // will be checked. We use the ASCII encoded Editorial Note
    // following the Abstract of the Web Cryptography API recommendation.
    var additionalData = new Uint8Array([84, 104, 101, 114, 101,
        32, 97, 114, 101, 32, 55, 32, 102, 117, 114, 116, 104, 101,
        114, 32, 101, 100, 105, 116, 111, 114, 105, 97, 108, 32,
        110, 111, 116, 101, 115, 32, 105, 110, 32, 116, 104, 101,
        32, 100, 111, 99, 117, 109, 101, 110, 116, 46]);

    //  The length of the tag defaults to 16 bytes (128 bit).
    var tag = {
        128: new Uint8Array([194, 226, 198, 253, 239, 28,
            197, 240, 123, 216, 176, 151, 239, 200, 184, 183]),
        192: new Uint8Array([183, 57, 32, 144, 164, 76, 121, 77, 58,
            86, 62, 132, 53, 130, 96, 225]),
        256: new Uint8Array([188, 239, 241, 48, 159, 21, 213, 0, 241,
            42, 85, 76, 194, 28, 49, 60])
    };

    var tag_with_empty_ad = {
        128: new Uint8Array([222, 51, 11, 23, 36, 222, 250, 248, 27, 98, 30, 81, 150, 35, 220, 198]),
        192: new Uint8Array([243, 11, 130, 112, 169, 239, 114, 238, 185, 219, 93, 1, 95, 108, 184, 183]),
        256: new Uint8Array([244, 186, 86, 203, 154, 37, 191, 248, 246, 57, 139, 130, 224, 47, 217, 238])
    };


    // Results. These were created using the Python cryptography module.

    // AES-GCM produces ciphertext and a tag.
    var ciphertext = {
        128: new Uint8Array([180, 241, 40, 183, 105,
            52, 147, 238, 224, 175, 175, 236, 168, 244, 241, 121, 9,
            202, 225, 237, 56, 216, 253, 254, 186, 102, 111, 207, 228,
            190, 130, 177, 159, 246, 6, 53, 249, 113, 228, 254, 81,
            126, 253, 191, 100, 43, 251, 147, 107, 91, 166, 231, 201,
            241, 180, 214, 112, 47, 123, 164, 186, 134, 54, 65, 22,
            181, 201, 82, 236, 59, 52, 139, 172, 39, 41, 89, 123, 62,
            102, 167, 82, 150, 250, 93, 96, 169, 135, 89, 245, 255,
            164, 192, 169, 159, 25, 16, 139, 145, 76, 4, 144, 131,
            148, 197, 204, 46, 23, 110, 193, 228, 127, 120, 242, 24,
            54, 240, 181, 162, 98, 244, 249, 68, 134, 122, 126, 151,
            38, 108, 116, 68, 150, 109, 38, 194, 21, 159, 140, 205,
            183, 35, 97, 151, 186, 120, 145, 22, 235, 22, 210, 223,
            187, 143, 162, 183, 93, 196, 104, 51, 96, 53, 234, 250,
            184, 76, 237, 157, 37, 203, 226, 87, 222, 75, 240, 95, 218,
            222, 64, 81, 165, 75, 201, 216, 190, 13, 116, 217, 69, 66,
            47, 161, 68, 247, 74, 253, 157, 181, 162, 121, 53, 32, 91,
            124, 230, 105, 224, 17, 187, 50, 61, 77, 103, 79, 71, 57,
            163, 116, 234, 149, 27, 105, 24, 31, 159, 3, 128, 130, 42,
            94, 125, 200, 142, 251, 148, 201, 17, 149, 232, 84, 50, 17,
            18, 203, 186, 226, 164, 227, 202, 76, 65, 16, 163, 224,
            132, 52, 31, 101, 129, 72, 171, 159, 42, 177, 253, 98, 86,
            201, 95, 117, 62, 12, 205, 78, 36, 126, 196, 121, 89, 185,
            37, 161, 66, 181, 117, 186, 71, 124, 132, 110, 120, 27,
            246, 163, 18, 13, 90, 200, 127, 82, 209, 241, 170, 73, 247,
            137, 96, 244, 254, 251, 119, 71, 156, 27, 107, 53, 33, 45,
            22, 0, 144, 48, 32, 11, 116, 21, 125, 246, 217, 171, 158,
            224, 142, 234, 141, 242, 168, 89, 154, 66, 227, 161, 182,
            96, 1, 88, 78, 12, 7, 239, 30, 206, 31, 89, 111, 107, 42,
            37, 241, 148, 232, 1, 8, 251, 117, 146, 183, 9, 48, 39, 94,
            59, 70, 230, 26, 165, 97, 156, 140, 141, 31, 62, 10, 206,
            55, 48, 207, 0, 197, 202, 197, 108, 133, 175, 80, 4, 16,
            154, 223, 255, 4, 196, 188, 178, 240, 29, 13, 120, 5, 225,
            202, 3, 35, 225, 158, 92, 152, 73, 205, 107, 157, 224, 245,
            99, 194, 171, 156, 245, 247, 183, 165, 40, 62, 200, 110,
            29, 151, 206, 100, 175, 88, 36, 242, 90, 4, 82, 73, 250,
            140, 245, 217, 9, 153, 35, 242, 206, 78, 197, 121, 115, 15,
            80, 128, 101, 191, 240, 91, 151, 249, 62, 62, 244, 18, 3,
            17, 135, 222, 210, 93, 149, 123]),

        192: new Uint8Array([126, 160, 166, 112, 227, 212, 106,
            186, 175, 70, 24, 28, 86, 149, 31, 154, 156, 190, 244, 132, 44, 61, 149,
            242, 105, 67, 17, 136, 7, 146, 153, 170, 200, 214, 142, 205, 170, 225,
            85, 44, 241, 159, 255, 234, 10, 13, 37, 48, 255, 21, 141, 176, 60, 117,
            73, 130, 247, 204, 144, 102, 167, 89, 203, 235, 229, 129, 122, 253, 124,
            179, 115, 118, 163, 157, 67, 141, 122, 146, 209, 11, 112, 5, 230, 117,
            123, 184, 243, 99, 83, 10, 31, 166, 96, 1, 121, 44, 10, 241, 24, 43,
            184, 187, 25, 239, 246, 176, 108, 230, 127, 25, 42, 67, 202, 140, 179,
            104, 159, 75, 103, 43, 248, 98, 166, 179, 67, 0, 163, 227, 84, 40, 129,
            227, 198, 205, 7, 156, 16, 185, 24, 166, 59, 218, 197, 114, 74, 34, 126,
            22, 226, 226, 85, 212, 69, 83, 163, 185, 68, 109, 182, 54, 209, 237, 96,
            184, 32, 53, 127, 175, 13, 146, 141, 115, 164, 184, 98, 245, 174, 223,
            46, 32, 167, 39, 103, 19, 210, 80, 131, 254, 103, 249, 247, 29, 120, 31,
            105, 241, 103, 169, 249, 93, 153, 74, 56, 53, 239, 157, 132, 236, 169,
            246, 242, 24, 113, 97, 128, 238, 152, 148, 31, 84, 8, 52, 105, 198, 116,
            103, 132, 48, 199, 23, 90, 24, 29, 63, 41, 117, 191, 57, 31, 209, 128,
            60, 119, 175, 84, 141, 177, 165, 169, 195, 35, 163, 105, 146, 157, 209,
            93, 149, 105, 160, 93, 231, 78, 201, 92, 235, 200, 89, 37, 50, 181, 30,
            213, 242, 59, 156, 219, 19, 158, 17, 224, 81, 108, 52, 87, 248, 101, 23,
            39, 107, 67, 151, 103, 230, 126, 202, 184, 118, 226, 18, 29, 93, 37, 208,
            40, 82, 113, 35, 157, 145, 152, 50, 253, 140, 47, 141, 192, 1, 148, 114,
            40, 10, 112, 79, 227, 16, 105, 247, 31, 49, 102, 195, 75, 183, 172, 254,
            188, 42, 89, 77, 38, 104, 1, 180, 106, 61, 71, 70, 35, 160, 103, 101,
            244, 26, 226, 37, 159, 155, 4, 107, 222, 219, 136, 37, 24, 246, 44, 23,
            44, 248, 132, 108, 59, 179, 99, 145, 132, 82, 53, 203, 111, 150, 55,
            123, 51, 214, 165, 108, 124, 179, 131, 174, 139, 224, 114, 96, 218, 181,
            243, 128, 198, 98, 115, 92, 95, 165, 23, 229, 108, 146, 14, 244, 162,
            37, 85, 201, 33, 44, 92, 106, 112, 185, 16, 189, 42, 114, 109, 59, 124,
            131, 16, 211, 31, 97, 29, 135, 61, 150, 75, 250, 207, 129, 38, 205, 187,
            186, 55, 207, 232, 24, 48, 232, 49, 226, 16, 12, 27, 70, 31, 124, 128,
            218, 100, 91, 200, 184, 78, 252, 100, 235, 62, 43, 69, 214, 163, 65, 14,
            44, 180]),

        256: new Uint8Array([8, 97, 235, 113, 70, 32, 135, 131,
            210, 209, 124, 160, 255, 182, 9, 29, 125, 193, 27, 240, 129, 46, 2, 137,
            169, 142, 61, 7, 145, 54, 170, 207, 159, 111, 39, 95, 87, 63, 162, 27,
            6, 18, 219, 215, 116, 34, 90, 57, 114, 244, 102, 145, 67, 6, 51, 152,
            247, 165, 242, 116, 100, 219, 177, 72, 177, 17, 110, 67, 93, 219, 100,
            217, 20, 207, 89, 154, 45, 37, 105, 83, 67, 162, 140, 235, 129, 40, 177,
            202, 174, 54, 148, 55, 156, 193, 232, 249, 134, 163, 195, 51, 114, 116,
            65, 38, 73, 99, 96, 249, 224, 69, 17, 119, 186, 188, 181, 43, 78, 156,
            76, 138, 226, 63, 5, 248, 9, 94, 26, 1, 2, 235, 39, 174, 74, 47, 183,
            22, 40, 47, 47, 13, 100, 119, 12, 67, 178, 184, 56, 167, 238, 143, 13,
            44, 208, 185, 151, 108, 6, 17, 52, 122, 182, 210, 207, 42, 219, 37, 74,
            94, 126, 36, 249, 37, 32, 4, 218, 44, 238, 69, 56, 219, 31, 77, 173, 46,
            187, 103, 36, 112, 213, 252, 40, 87, 164, 240, 163, 159, 32, 129, 125,
            178, 108, 47, 28, 31, 36, 42, 115, 36, 14, 145, 195, 156, 191, 46, 163,
            249, 181, 31, 90, 73, 30, 72, 57, 223, 63, 60, 79, 140, 14, 117, 31,
            145, 222, 156, 121, 237, 32, 145, 143, 96, 12, 254, 35, 21, 21, 59, 168,
            171, 154, 217, 0, 59, 202, 175, 103, 214, 192, 175, 26, 18, 43, 54, 176,
            222, 75, 22, 7, 122, 253, 224, 145, 61, 42, 208, 73, 237, 84, 141, 209,
            213, 228, 46, 244, 59, 9, 68, 6, 35, 88, 189, 10, 62, 9, 85, 28, 44, 82,
            19, 153, 160, 178, 240, 56, 160, 244, 201, 173, 77, 61, 20, 227, 30,
            180, 167, 16, 105, 185, 193, 95, 207, 41, 23, 134, 78, 198, 182, 93, 24,
            89, 247, 231, 75, 233, 194, 137, 242, 114, 194, 190, 130, 138, 238, 94,
            137, 193, 194, 115, 137, 190, 207, 169, 83, 155, 14, 210, 160, 129, 195,
            161, 234, 221, 255, 114, 67, 98, 12, 93, 41, 65, 183, 244, 103, 247,
            101, 82, 246, 125, 87, 125, 78, 21, 186, 102, 205, 20, 40, 32, 201, 174,
            15, 52, 240, 217, 180, 162, 108, 6, 211, 41, 18, 135, 232, 184, 18, 188,
            169, 157, 190, 76, 166, 75, 176, 127, 39, 251, 22, 203, 153, 80, 49,
            241, 124, 137, 151, 123, 204, 43, 159, 190, 177, 196, 18, 117, 169, 46,
            152, 251, 45, 25, 164, 27, 145, 214, 228, 55, 15, 2, 131, 216, 80, 255,
            204, 175, 100, 59, 145, 15, 103, 40, 33, 45, 255, 200, 254, 172, 138,
            20, 58, 87, 182, 192, 148, 219, 41, 88, 230, 229, 70, 249])
    };

    var keyLengths = [128, 192, 256];
    var tagLengths = [32, 64, 96, 104, 112, 120, 128];

    // All the scenarios that should succeed, if the key has "encrypt" usage
    var passing = [];
    keyLengths.forEach(function(keyLength) {
        tagLengths.forEach(function(tagLength) {
            var byteCount = tagLength / 8;

            var result = new Uint8Array(ciphertext[keyLength].byteLength + byteCount);
            result.set(ciphertext[keyLength], 0);
            result.set(tag[keyLength].slice(0, byteCount), ciphertext[keyLength].byteLength);
            passing.push({
                    name: "AES-GCM " + keyLength.toString() + "-bit key, " + tagLength.toString() + "-bit tag",
                    keyBuffer: keyBytes[keyLength],
                    key: null,
                    algorithm: {name: "AES-GCM", iv: iv, additionalData: additionalData, tagLength: tagLength},
                    plaintext: plaintext,
                    result: result
            });

            var noadresult = new Uint8Array(ciphertext[keyLength].byteLength + byteCount);
            noadresult.set(ciphertext[keyLength], 0);
            noadresult.set(tag_with_empty_ad[keyLength].slice(0, byteCount), ciphertext[keyLength].byteLength);
            passing.push({
                    name: "AES-GCM " + keyLength.toString() + "-bit key, no additional data, " + tagLength.toString() + "-bit tag",
                    keyBuffer: keyBytes[keyLength],
                    key: null,
                    algorithm: {name: "AES-GCM", iv: iv, tagLength: tagLength},
                    plaintext: plaintext,
                    result: noadresult
            });
        });
    });

    // Scenarios that should fail because of a bad tag length, causing an OperationError
    var failing = [];
    keyLengths.forEach(function(keyLength) {
        // First, make some tests for bad tag lengths
        [24, 48, 72, 95, 129].forEach(function(badTagLength) {
            failing.push({
                name: "AES-GCM " + keyLength.toString() + "-bit key, illegal tag length " + badTagLength.toString() + "-bits",
                keyBuffer: keyBytes[keyLength],
                key: null,
                algorithm: {name: "AES-GCM", iv: iv, additionalData: additionalData, tagLength: badTagLength},
                plaintext: plaintext,
                result: ciphertext[keyLength]
            });
        });
    });

    return {passing: passing, failing: failing, decryptionFailing: []};
}
