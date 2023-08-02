pragma circom 2.1.4;

include "../circomlib/circuits/poseidon.circom";

template Example (N) {

    signal input hashes[N];
    signal input pub_keys[N];
    signal input msg;

    signal output attestation;

    var hash_count;
    component hashGen[N];

    for (var i = 0; i < N; i++){
        hashGen[i] = Poseidon(2);
        hashGen[i].inputs[0] <== msg;
        hashGen[i].inputs[1] <== pub_keys[i];

        hash_count += hashes[i] - hashGen[i].out;
    }
    
    attestation <== hash_count;
}

component main { public [ hashes, pub_keys ] } = Example(3);