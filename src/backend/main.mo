import Text "mo:core/Text";

actor {
  public query ({ caller }) func hello() : async Text {
    "Hello from AWARA!";
  };
};
