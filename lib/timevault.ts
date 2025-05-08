/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/timevault.json`.
 */
export type Timevault = {
  "address": "5RQg8HaGADZUWhqB6UAKf98XnnSkdCJeqByaFG4ES5Rb",
  "metadata": {
    "name": "timevault",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createCapsule",
      "discriminator": [
        195,
        104,
        42,
        180,
        127,
        169,
        62,
        3
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "capsule",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  112,
                  115,
                  117,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "arg",
                "path": "unlockTime"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "unlockTime",
          "type": "i64"
        },
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "contentType",
          "type": "string"
        },
        {
          "name": "contentUri",
          "type": "string"
        }
      ]
    },
    {
      "name": "openCapsule",
      "discriminator": [
        131,
        241,
        204,
        150,
        253,
        59,
        125,
        58
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true,
          "relations": [
            "capsule"
          ]
        },
        {
          "name": "capsule",
          "writable": true
        },
        {
          "name": "clock",
          "address": "SysvarC1ock11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "timeCapsule",
      "discriminator": [
        38,
        234,
        70,
        41,
        29,
        26,
        27,
        7
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unlockTooEarly",
      "msg": "Capsule not Open yet."
    }
  ],
  "types": [
    {
      "name": "timeCapsule",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "unlockTime",
            "type": "i64"
          },
          {
            "name": "contentType",
            "type": "string"
          },
          {
            "name": "contentUri",
            "type": "string"
          },
          {
            "name": "isUnlocked",
            "type": "bool"
          }
        ]
      }
    }
  ]
};
